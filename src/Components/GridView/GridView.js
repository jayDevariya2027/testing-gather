import { Tree } from "react-complex-tree";

const GridView = ({ tree, onExpand, onCollapse, onDragEnd, onDragEnter, onDragStart, onDragLeave }) => (
    <Tree
        tree={tree}
        renderItem={({ item, depth, onExpand, onCollapse, provided }) => (
            <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    padding: '10px',
                    margin: '5px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    backgroundColor: item.data.type === 'section' ? '#f0f0f0' : '#fff',
                    ...provided.draggableProps.style,
                }}
                onDragStart={() => onDragStart(item.id)}
                onDragEnter={() => onDragEnter(item.id)}
                onDragLeave={() => onDragLeave()}
            >
                <div style={{ flex: 1 }}>{item.data.title}</div>
                {item.hasChildren && (
                    <button
                        onClick={() =>
                            item.isExpanded ? onCollapse(item.id) : onExpand(item.id)
                        }
                    >
                        {item.isExpanded ? 'Collapse' : 'Expand'}
                    </button>
                )}
            </div>
        )}
        onExpand={onExpand}
        onCollapse={onCollapse}
        onDragEnd={onDragEnd}
        isDragEnabled
        isNestingEnabled
    />
);

export default GridView