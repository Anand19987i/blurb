import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { POST_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import TextareaAutosize from "react-textarea-autosize";
import { useSelector } from 'react-redux';
import { MdPhotoLibrary } from 'react-icons/md'; // Gallery icon
import store from '@/redux/store';

const CreatePostDialog = ({ open, setOpen }) => {
  const { user } = useSelector(store => store.auth);
  const [input, setInput] = useState({
    content: "",
    imageUrl: null, // Store image URL here
  });

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const imageChangeHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Generate a preview URL for the selected image
      const imageUrl = URL.createObjectURL(file);
      setInput({ ...input, imageUrl: imageUrl, imageFile: file }); // Store the file and image URL
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("content", input.content);
    formData.append("userId", user?.id);

    // Append the image file to the formData if it's selected
    if (input.imageFile) {
        formData.append("image", input.imageFile);
    }

    try {
        const res = await axios.post(`${POST_API_END_POINT}/feed`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
        });

        if (res.status === 201) {
            setOpen(false);
            setInput({ content: "", imageUrl: null, imageFile: null });
        }
    } catch (error) {
        console.log(error);
    }
};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-slate-950 max-h-[80vh] overflow-y-auto p-4" onInteractOutside={() => setOpen(false)}>
        <DialogHeader>
          <DialogTitle className="text-white">Create Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={submitHandler}>
          <TextareaAutosize
            className='w-full outline-none p-2 bg-gray-900 text-gray-100'
            name="content"
            value={input.content}
            onChange={changeEventHandler}
            placeholder="What you want to ask and share"
          />

          <div className="my-3">
            <label htmlFor="image" className="block text-white cursor-pointer">
              <MdPhotoLibrary size={30} className="text-gray-300 hover:text-gray-500" />
            </label>
            <input
              id="image"
              type="file"
              name="imageUrl"
              accept="image/*"
              onChange={imageChangeHandler}
              className="hidden"
            />

            {/* Show image preview if an image is selected */}
            {input.imageUrl && (
              <div className="mt-3">
                <img
                  src={input.imageUrl}
                  alt="Selected Preview"
                  className="w-48 h-auto rounded-md mx-auto"
                />
              </div>
            )}
          </div>

          <DialogFooter className="my-3">
            <button type="submit" className="bg-white text-black p-2 rounded-md">
              Create
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
