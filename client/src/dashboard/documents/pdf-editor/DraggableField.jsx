import React, { useRef, useEffect, useState } from 'react';
import { Rect, Text, Group, Transformer, Image as KonvaImage, Circle } from 'react-konva';

const DraggableField = ({
  field,
  isSelected,
  onSelect,
  onChange,
  onDelete,
  isOwned,
  onClick,
}) => {
  const shapeRef = useRef(null);
  const trRef = useRef(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  // Load signature image if available
  useEffect(() => {
    if (field.response && field.response.startsWith('data:image')) {
      const img = new window.Image();
      img.src = field.response;
      img.onload = () => {
        setImage(img);
      };
    } else {
      setImage(null);
    }
  }, [field.response]);

  const handleDragEnd = (e) => {
    onChange({
      xPosition: e.target.x(),
      yPosition: e.target.y(),
    });
  };

  const handleTransformEnd = () => {
    const node = shapeRef.current;
    if (node) {
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();

      node.scaleX(1);
      node.scaleY(1);

      onChange({
        xPosition: node.x(),
        yPosition: node.y(),
        Width: Math.max(5, node.width() * scaleX),
        Height: Math.max(5, node.height() * scaleY),
      });
    }
  };

  const getFieldColor = () => {
    if (!isOwned) return '#9ca3af';
    if (field.response) return '#10b981';
    
    switch (field.type) {
      case 'signature':
      case 'initials':
        return '#3b82f6';
      case 'stamp':
        return '#8b5cf6';
      case 'text':
      case 'name':
      case 'email':
        return '#10b981';
      case 'date':
        return '#f59e0b';
      case 'checkbox':
      case 'radio':
        return '#ef4444';
      default:
        return '#3b82f6';
    }
  };

  const getFieldText = () => {
    if (field.response) {
      if (field.response.startsWith('data:image')) {
        return '✓ SIGNED';
      }
      // Don't truncate text - let it display fully
      return field.response;
    }
    return isOwned ? field.type.toUpperCase() : '🔒 ' + field.type.toUpperCase();
  };

  // Calculate dynamic font size based on field dimensions and content
  const getDynamicFontSize = () => {
    const minFontSize = 10;
    const maxFontSize = 24;
    const text = getFieldText();
    
    if (!text || field.response?.startsWith('data:image')) return minFontSize;
    
    // Calculate font size based on field width and text length
    const baseSize = Math.min(field.Width / text.length * 1.2, field.Height * 0.4);
    return Math.max(minFontSize, Math.min(maxFontSize, baseSize));
  };

  const [clickState, setClickState] = useState('none');
  
  const handleFieldClick = (e) => {
    e.cancelBubble = true;
    
    if (clickState === 'none') {
      onSelect();
      setClickState('selected');
    } else if (clickState === 'selected') {
      setClickState('resizing');
    } else {
      onClick();
      setClickState('none');
    }
  };

  return (
    <>
      <Group
        ref={shapeRef}
        x={field.xPosition}
        y={field.yPosition}
        width={field.Width}
        height={field.Height}
        draggable={true}
        onClick={handleFieldClick}
        onTap={handleFieldClick}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        onMouseEnter={(e) => {
          const container = e.target.getStage()?.container();
          if (container) container.style.cursor = "move";
        }}
        onMouseLeave={(e) => {
          const container = e.target.getStage()?.container();
          if (container) container.style.cursor = "default";
        }}
      >
        <Rect
          width={field.Width}
          height={field.Height}
          fill={getFieldColor() + (field.response ? "40" : "20")}
          stroke={getFieldColor()}
          strokeWidth={isSelected ? 1 : 0}
          dash={isSelected ? [] : field.response ? [] : [5, 5]}
          cornerRadius={0}
          opacity={isOwned ? 1 : 0.6}
        />

        {image && (
          <KonvaImage
            image={image}
            width={field.Width - 4}
            height={field.Height - 4}
            x={2}
            y={2}
            listening={false}
          />
        )}

        {(!image || !field.response?.startsWith("data:image")) && (
          <Text
            text={getFieldText()}
            fontSize={getDynamicFontSize()}
            fontFamily={
              field.type === "signature" &&
              field.response &&
              !field.response.startsWith("data:")
                ? "cursive"
                : "Arial"
            }
            fill={getFieldColor()}
            width={field.Width - 8}
            height={field.Height - 8}
            x={4}
            y={4}
            align="center"
            verticalAlign="middle"
            fontStyle="bold"
            wrap="word"
            ellipsis={false}
          />
        )}

        {isSelected && (
          <Circle
            x={field.Width}
            y={0}
            radius={5}
            fill="#ef4444"
            stroke="#ffffff"
            strokeWidth={1}
            onClick={(e) => {
              e.cancelBubble = true;
              onDelete();
            }}
            onMouseOver={{ cursor: "pointer" }}
            onTap={(e) => {
              e.cancelBubble = true;
              onDelete();
            }}
          />
        )}
      </Group>
      {isSelected && (
        <Transformer
          ref={trRef}
          padding={10}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 20 || newBox.height < 20) {
              return oldBox;
            }
            return newBox;
          }}
          enabledAnchors={[
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
          ]}
          rotateEnabled={false}
          keepRatio={false}
        />
      )}
    </>
  );
};

export default DraggableField;
