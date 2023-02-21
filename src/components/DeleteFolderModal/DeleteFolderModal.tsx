import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'react-hot-toast';

// for type declaration 
type ModalProps = {
    title: string;
    modalData: { _id: string, name: string };
    refetch: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<any, unknown>>
}
type Folder = {
    _id: string,
    name: string
}
const DeleteFolderModal = ({ title, modalData, refetch }: ModalProps) => {

    const handleDeleteFolder = (deleteFolder: Folder) => {
        fetch(`https://ostad-first-task-server.vercel.app/deleteFolder/${deleteFolder?._id}`, {
            method: 'DELETE'
        })
            .then(res => res.json())
            .then(data => {
                refetch();
                console.log(data);
                if (data.acknowledged) {
                    window.location.reload();
                    //refetch is not working here, that's why i'm using reload()
                    refetch();
                    toast.success(`Folder '${deleteFolder?.name}' is deleted successfully`)
                }
                refetch();
            })
    }
    // for delete folder
    return (
        <div>
            <input type="checkbox" id="delete_modal" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    <h3 className="mb-4 text-3xl font-bold text-center">{title}</h3>
                    <div className="justify-center modal-action">
                        <label htmlFor="delete_modal" className="text-white bg-green-500 border-none btn">Cancel</label>
                        <label onClick={() => handleDeleteFolder(modalData)} htmlFor="delete_modal" className="text-white bg-red-600 border-none btn">Delete</label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteFolderModal;