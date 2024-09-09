import React, { useState } from 'react';
import Tree, { moveItemOnTree, mutateTree } from '@atlaskit/tree';
import './App.css';

const initialTree = {
  rootId: 'root',
  items: {
    root: {
      id: 'root',
      children: ['1', '2', '3', 'doc7', 'doc8'],
      hasChildren: true,
      isExpanded: true,
      isChildrenLoading: false,
      data: {
        title: 'Root',
        type: 'root',
      },
    },
    '1': {
      id: '1',
      children: ['doc1', 'doc2'],
      hasChildren: true,
      isExpanded: true,
      isChildrenLoading: false,
      data: {
        title: 'Australian Cities',
        type: 'section',
      },
    },
    '2': {
      id: '2',
      children: ['doc3', 'doc4'],
      hasChildren: true,
      isExpanded: true,
      isChildrenLoading: false,
      data: {
        title: 'Indian Cities',
        type: 'section',
      },
    },
    '3': {
      id: '3',
      children: ['doc5', 'doc6'],
      hasChildren: true,
      isExpanded: true,
      isChildrenLoading: false,
      data: {
        title: 'US Cities',
        type: 'section',
      },
    },
    doc1: { id: 'doc1', children: [], hasChildren: false, data: { title: 'Sydney', type: 'doc' } },
    doc2: { id: 'doc2', children: [], hasChildren: false, data: { title: 'Melbourne', type: 'doc' } },
    doc3: { id: 'doc3', children: [], hasChildren: false, data: { title: 'Delhi', type: 'doc' } },
    doc4: { id: 'doc4', children: [], hasChildren: false, data: { title: 'Mumbai', type: 'doc' } },
    doc5: { id: 'doc5', children: [], hasChildren: false, data: { title: 'New York', type: 'doc' } },
    doc6: { id: 'doc6', children: [], hasChildren: false, data: { title: 'Los Angeles', type: 'doc' } },
    doc7: { id: 'doc7', children: [], hasChildren: false, data: { title: 'Doc 1 (Standalone)', type: 'doc' } },
    doc8: { id: 'doc8', children: [], hasChildren: false, data: { title: 'Doc 2 (Standalone)', type: 'doc' } },
  },
};

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

const ListView = ({ tree, onExpand, onCollapse, onDragEnd, onDragEnter, onDragStart, onDragLeave }) => (
  <Tree
    tree={tree}
    renderItem={({ item, depth, onExpand, onCollapse, provided }) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        style={{
          paddingLeft: depth * 20,
          padding: '10px',
          margin: '5px 0',
          border: '1px solid #ddd',
          borderRadius: '5px',
          backgroundColor: item.data.type === 'section' ? '#f0f0f0' : '#fff',
          ...provided.draggableProps.style,
        }}
        onDragStart={() => onDragStart(item.id)}
        onDragEnter={() => onDragEnter(item.id)}
        onDragLeave={() => onDragLeave()}
      >
        {item.data.title}
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

const App = () => {
  const [tree, setTree] = useState(initialTree);
  const [view, setView] = useState('list'); // Toggle between 'list' and 'grid'
  const [draggingId, setDraggingId] = useState(null);
  const [placeholderId, setPlaceholderId] = useState(null);

  const handleExpandCollapse = (itemId) => {
    const newTree = mutateTree(tree, itemId, {
      isExpanded: !tree.items[itemId].isExpanded,
    });
    setTree(newTree);
  };

  const onDragStart = (itemId) => {
    setDraggingId(itemId);
  };

  const onDragEnd = (source, destination) => {
    if (!destination) {
      setDraggingId(null);
      setPlaceholderId(null);
      return;
    }

    const { parentId: sourceParentId, index: sourceIndex } = source;
    const { parentId: destinationParentId, index: destinationIndex } = destination;
    const sourceItemId = tree.items[sourceParentId]?.children[sourceIndex];
    const sourceItem = tree.items[sourceItemId];

    if (sourceItem.data.type === 'section' && destinationParentId !== 'root') {
      console.log('Invalid drop target. Sections can only be dropped into the root.');
      setDraggingId(null);
      setPlaceholderId(null);
      return;
    }

    const newTree = moveItemOnTree(tree, source, destination);
    setTree(newTree);
    setDraggingId(null);
    setPlaceholderId(null);
  };

  const onDragEnter = (itemId) => {
    setPlaceholderId(itemId);
  };

  const onDragLeave = () => {
    setPlaceholderId(null);
  };

  return (
    <div>
      {/* View toggle buttons */}
      <div>
        <button onClick={() => setView('list')}>List View</button>
        <button onClick={() => setView('grid')}>Grid View</button>
      </div>

      {/* Render Tree with the appropriate view */}
      <div
        style={{ height: '500px', overflowY: 'auto' }}
        onDragOver={(e) => e.preventDefault()}
      >
        {view === 'list' ? (
          <ListView
            tree={tree}
            onExpand={(itemId) => handleExpandCollapse(itemId)}
            onCollapse={(itemId) => handleExpandCollapse(itemId)}
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
          />
        ) : (
          <GridView
            tree={tree}
            onExpand={(itemId) => handleExpandCollapse(itemId)}
            onCollapse={(itemId) => handleExpandCollapse(itemId)}
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
          />
        )}
      </div>
    </div>
  );
};

export default App;
