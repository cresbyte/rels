import { useMemo } from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import DragProvider from "./components/DragProivder";
import { pdfjs } from "react-pdf";
import "./index.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

export default function OpenSignWrapper({ Page }) {
  const MemoPage = useMemo(() => Page, [Page]);
  return (
    <Provider store={store}>
      <DragProvider Page={MemoPage} />
    </Provider>
  );
}


