import React, { useState } from 'react';

const AreYouSureToDelete = ({ onCancel, onConfirm, itemName = "this item" }) => {
    return (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
                <div className="bg-red-600 p-4">
                    <h3 className="text-xl font-bold text-white">Confirm Deletion</h3>
                </div>

                <div className="p-6">
                    <div className="mb-6">
                        <p className="text-gray-700 text-lg mb-2">
                            Are you sure you want to delete {itemName}?
                        </p>
                        <p className="text-gray-500 text-sm">
                            This action cannot be undone.
                        </p>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white font-medium transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AreYouSureToDelete;