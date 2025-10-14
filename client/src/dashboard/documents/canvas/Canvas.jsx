import { useCallback, useEffect, useRef } from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { Document, Page, pdfjs } from "react-pdf";
import { useDrop, useDragLayer } from "react-dnd";
import { ItemTypes } from "./FieldsLayer";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

export function CustomDragLayer() {
  const { isDragging } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
  }));
  if (!isDragging) return null;
  // Invisible drag layer for natural feel
  return null;
}

function PdfPageDrop({ pageNumber, scale, children, onDrop, setRef }) {
  const pageRef = useRef(null);
  const [{ isOver }, dropRef] = useDrop(
    () => ({
      accept: [ItemTypes.FIELD, ItemTypes.PLACED_FIELD],
      drop: (item, monitor) => {
        if (!pageRef.current) return;
        const rect = pageRef.current.getBoundingClientRect();
        const clientOffset = monitor.getClientOffset();
        if (!clientOffset) return;
        
        // Calculate position relative to the page element
        let x = clientOffset.x - rect.left;
        let y = clientOffset.y - rect.top;
        
        // For existing fields being moved, adjust for the drag offset
        if (item && item.id) {
          const initialOffset = monitor.getInitialClientOffset();
          const initialSourceClientOffset = monitor.getInitialSourceClientOffset();
          if (initialOffset && initialSourceClientOffset) {
            // Calculate the offset from the initial mouse position to the element's top-left
            const offsetX = initialSourceClientOffset.x - initialOffset.x;
            const offsetY = initialSourceClientOffset.y - initialOffset.y;
            x -= offsetX;
            y -= offsetY;
          }
          onDrop({ x, y }, { ...item, _move: true });
          return;
        }
        
        onDrop({ x, y }, item);
      },
      collect: (monitor) => ({ isOver: monitor.isOver({ shallow: true }) }),
    }),
    [onDrop]
  );

  dropRef(pageRef);
  useEffect(() => {
    if (setRef) setRef(pageRef.current);
  }, [setRef]);

  return (
    <Box sx={{ position: "relative", display: "inline-block", m: 2 }}>
      <Box ref={pageRef} sx={{ position: "relative", outline: isOver ? "2px dashed #1976d2" : "none" }}>
        <Page pageNumber={pageNumber} scale={scale} renderAnnotationLayer={false} renderTextLayer={false} />
        <Box sx={{ position: "absolute", inset: 0 }}>{children}</Box>
      </Box>
    </Box>
  );
}

export default function Canvas({ fileUrl, scale, numPages, setNumPages, onDropField, renderFields, pageRefs }) {
  const handleLoadSuccess = useCallback(({ numPages: n }) => setNumPages(n), [setNumPages]);

  return (
    <Stack direction="row" spacing={2} sx={{ height: "100%", p: 2 }}>
      <Paper elevation={1} sx={{ width: 180, p: 1, flexShrink: 0, overflow: "auto", maxHeight: "calc(100vh - 24px)", position: "sticky", top: 12, alignSelf: "flex-start" }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Pages</Typography>
        <Document file={fileUrl} onLoadSuccess={({ numPages: n }) => setNumPages(n)}>
          {Array.from({ length: numPages }, (_, i) => i + 1).map((p) => (
            <Box key={p} onClick={() => pageRefs.current[p]?.scrollIntoView?.({ behavior: "smooth", block: "center" })} sx={{ cursor: "pointer", mb: 1, border: "1px solid rgba(0,0,0,0.12)" }}>
              <Page pageNumber={p} width={140} renderAnnotationLayer={false} renderTextLayer={false} />
            </Box>
          ))}
        </Document>
      </Paper>

      <Box sx={{ flex: 1, overflow: "auto" }}>
        <Document file={fileUrl} onLoadSuccess={handleLoadSuccess} loading={<Typography sx={{ p: 2 }}>Loading PDF…</Typography>}>
          {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNumber) => (
            <PdfPageDrop
              key={pageNumber}
              pageNumber={pageNumber}
              scale={scale}
              onDrop={(offset, item) => onDropField(pageNumber, offset, item)}
              setRef={(el) => {
                if (el) pageRefs.current[pageNumber] = el;
              }}
            >
              {renderFields(pageNumber)}
            </PdfPageDrop>
          ))}
        </Document>
      </Box>
    </Stack>
  );
}


