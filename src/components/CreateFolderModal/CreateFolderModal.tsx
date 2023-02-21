import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

// for type declaration 
type ModalProps = {
    title: string;
    modalData: { _id: string, name: string };
    refetch: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<any, unknown>>
}

const CreateFolderModal = ({ title, modalData, refetch }: ModalProps) => {
    const [folderName, setFolderName] = useState('');

    const writeFolderName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFolderName(event.target.value);
    }
    const handleCreateFolder = (event: React.MouseEvent<HTMLLabelElement>) => {
        if (folderName.length === 0) {
            return;
        }
        // destructuring modalData 
        const { _id } = modalData;

        //for value set in createFolderInfo object
        const createFolderInfo = {
            parentId: _id,
            name: folderName
        }
        // for post the object value 
        fetch('https://ostad-first-task-server.vercel.app/createFolder', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(createFolderInfo)
        })
            .then(res => res.json())
            .then(data => {
                refetch();
                console.log(data);
                if (data.acknowledged) {
                    refetch();
                    //refetch is not working here, that's why i'm using reload()
                    window.location.reload();
                    setFolderName('');
                    toast.success(`Folder ${folderName} created  successfully`);
                }
                else {
                    refetch()
                    window.location.reload();
                    setFolderName('');
                    toast.error(data.message);
                }
            })

    }
    // for create folder 
    return (
        <div>
            <input type="checkbox" id="create_modal" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    <div className='flex flex-col items-center'>
                        <h3 className="mb-4 text-3xl font-bold ">{title}</h3>
                        <input type="text" onChange={writeFolderName} placeholder="folder name" className="w-full max-w-xs input input-bordered" value={folderName} />
                    </div>
                    <div className="modal-action">
                        <label htmlFor="create_modal" className="text-white bg-red-500 border-none btn">Cancel</label>
                        <label onClick={handleCreateFolder} htmlFor="create_modal" className="text-white bg-green-600 border-none btn">Create</label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateFolderModal;