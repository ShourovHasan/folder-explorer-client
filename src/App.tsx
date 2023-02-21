import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import CreateFolderModal from './components/CreateFolderModal/CreateFolderModal';
import { FcFolder, FcPlus } from "react-icons/fc";
import { FaTrashAlt } from "react-icons/fa";
import './App.css';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import DeleteFolderModal from './components/DeleteFolderModal/DeleteFolderModal';


interface Folder {
  _id: string;
  name: string;
  parentId: string;
}
interface Folder2 {
  _id: string;
  name: string;
}

function App() {
  const [rootFolders, setRootFolders] = useState({ name: '', _id: '' });
  const [subFolders, setSubFolders] = useState<Folder[]>([]);

  const [createFolder, setCreateFolder] = useState({ name: '', _id: '' });
  const [deleteFolder, setDeleteFolder] = useState({ name: '', _id: '' });
  const [expand, setExpand] = useState(false);

  //for get all folders
  const { data: folders = [], refetch } = useQuery({
    queryKey: ['folders'],
    queryFn: async () => {
      const res = await fetch('https://ostad-first-task-server.vercel.app/folders')
      const data = await res.json();
      return data;
    }
  })

  //find the root folder
  useEffect(() => {
    const rootFolder = folders.filter((folder: Folder) => !folder.parentId);
    setRootFolders(rootFolder[0]);
  }, [folders]);

  // find the child folders
  const renderFolder = (folder: Folder | Folder2) => {
    const subFolders = folders.filter(
      (subFolder: Folder) => subFolder.parentId === folder._id);
    subFolders.length ? setSubFolders(subFolders) : <h3>No folders found</h3>
  };

  return (
    <div style={{ padding: '15px 25px' }}>
      <h2 className='mb-3 text-3xl text-center'>Folder Structure</h2>
      {/* for root data showing  */}
      {
        rootFolders &&
        <div className='mb-1 root bg-slate-100 ' onClick={() => renderFolder(rootFolders)}>
          <span onClick={() => setExpand(!expand)} className='folder_structure w-96 '>
            <FcFolder className='folder_margin'></FcFolder>
            <span>{rootFolders?.name}</span>
          </span>
          <label onClick={() => setCreateFolder(rootFolders)} htmlFor="create_modal" className="create_structure">
            <span className='create_structure'> <FcPlus></FcPlus> New</span>
          </label>
        </div>
      }
      {/* for child data showing  */}
      <div style={{ display: expand ? 'block' : 'none' }}>
        {
          subFolders &&
          subFolders.map((cData: Folder) =>
            <div key={cData._id}
              className='flex items-center justify-between mb-1 text-2xl ml-7 w-96 bg-slate-100'
            >
              <span className='flex items-center w-96' onClick={() => renderFolder(cData)}>
                <FcFolder className='mr-1'></FcFolder>
                <span>{cData?.name}</span>
              </span>
              <label onClick={() => setDeleteFolder(cData)} htmlFor="delete_modal" className="p-1 create_structure">
                <span className='create_structure'>
                  <FaTrashAlt className='mr-2 text-red-500'></FaTrashAlt>
                </span>
              </label>
              <label onClick={() => setCreateFolder(cData)} htmlFor="create_modal" className="create_structure">
                <span className='create_structure '><FcPlus></FcPlus> New</span>
              </label>
            </div>
          )
        }
      </div>
      {/* for create a folder  */}
      {
        createFolder &&
        <CreateFolderModal
          title={`Add folder in '${createFolder.name}'`}
          modalData={createFolder}
          refetch={refetch}
        ></CreateFolderModal>
      }
      {/* for delete a folder  */}
      {
        deleteFolder &&
        <DeleteFolderModal
          title={`Delete '${deleteFolder.name}'`}
          modalData={deleteFolder}
          refetch={refetch}
        ></DeleteFolderModal>
      }
      {/* For showing toaster  */}
      <Toaster />
    </div>
  );
}

export default App;