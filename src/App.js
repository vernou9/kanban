import React,{useState} from 'react';
import { DragDropContext,Droppable,Draggable } from 'react-beautiful-dnd';
import {v4 as uuid} from 'uuid'

const itemsFromBackend = [
  {id:uuid(), content:'First task'},
  {id:uuid(), content:'Second task'}
];

const columnsFromBackend = 
  {
    [uuid()] :{
      name: 'Todo',
      items: itemsFromBackend
    },
    [uuid()]:{
      name:'In Progress',
      items: []
    }
  } ;

const onDragEnd =  (result, columns, SetColumns) => {
  if (!result.destination) return;
  const {source, destination} = result;
  if(source.droppableId !==destination.droppableId){
      const sourceColumn = columns[source.droppableId]
    const destColumn = columns[destination.droppableId]
    const sourceItems = [...sourceColumn.items] 
    const destItems = [...destColumn.items]
    const [removed] = sourceItems.splice(source.index, 1)
    destItems.splice(destination.index,0 , removed);
    SetColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems
      }
    })
  } else {
    const column = columns[source.droppableId]
    const copiedItems= [...column.items]
    const [removed] = copiedItems.cplice(source.index, 1);
    copiedItems.splice(destination.index, 0 , removed);
    SetColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items:copiedItems
      }
    })
  }
 
};

function App() {
  const [columns,SetColumns]= useState(columnsFromBackend);

  return (
    <div 
      style={{
        display:'flex', 
        justifyContent:'center',
        height:'100'
      }}
     
        >
      <DragDropContext
       onDragEnd={result => console.log(result)}
      >
        {Object.entries(columns).map(([id, column]) => {
          return (
            <div style={{display: 'flex',flexDirection: 'column', alignItems:'center'}}>
              <h2>{column.name}</h2>
              <div style={{marign: 8}}>
            <Droppable droppableId={id} key={id} style={{marign: 8}}>
              {(provided,snapshot) => {
                return (
                  <div 
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style= {{
                    background: snapshot.isDraggingOver ? 'lightblue': 'lightgrey',
                    padding: 4,
                    width:250,
                    minheight:1000
                  }}
                  >
                    {column.items.map((item,index) => {
                      return(
                      <Draggable 
                      key={item.id} 
                      draggableId={item.id} 
                      index={index}> 
                        {(provided,snapshot) => {
                          return(
                            <div 
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style ={{
                              userSelect: 'none',
                              padding: 16,
                              marign: '0 0 8px 0',
                              minHeight : '50px',
                              backgroundColor: snapshot.isDragging ? '#263B4A' : '#456C86',
                              color:'white',
                              ...provided.draggableProps.styles
                            }}
                            >
                              {item.content}
                            </div>
                          )
                        }}
                      </Draggable>
                      )
                    })}
                    {provided.placeholder}
                  </div>
                )
              }

              }
            </Droppable>
            </div>
            </div>
          )
        }
        )
        }
      </DragDropContext>
    </div>
  );
}

export default App;
