import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { POST_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { MdPhotoLibrary } from 'react-icons/md';
import { ImSpinner2 } from 'react-icons/im';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "./styles/quill.css";

const CreatePostDialog = ({ open, setOpen }) => {
  const { user } = useSelector((store) => store.auth);
  const [content, setContent] = useState('');
  const [input, setInput] = useState({ imageUrl: null });
  const [loading, setLoading] = useState(false);

  const quillRef = useRef(null); // Create a ref for ReactQuill

  const imageChangeHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setInput({ ...input, imageUrl, imageFile: file });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('content', content);
    formData.append('userId', user?.id);

    if (input.imageFile) {
      formData.append('image', input.imageFile);
    }

    try {
      const res = await axios.post(`${POST_API_END_POINT}/feed`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      if (res.status === 201) {
        setOpen(false);
        setContent('');
        setInput({ imageUrl: null, imageFile: null });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="bg-slate-950 max-h-[80vh] overflow-y-auto p-4"
        onInteractOutside={() => setOpen(false)}
      >
        <DialogHeader>
          <DialogTitle className="text-white">Create Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={submitHandler}>
          <ReactQuill
            ref={quillRef} // Attach ref to ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            placeholder="What you want to ask and share"
            className="bg-gray-900 text-white text-sm rounded-md mb-3"
          />

          <div className="my-3">
            <label htmlFor="image" className="block text-white cursor-pointer">
              <MdPhotoLibrary size={30} className="text-gray-100 hover:text-gray-500" />
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={imageChangeHandler}
              className="hidden"
            />

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
            <button
              type="submit"
              className="bg-white text-black p-2 rounded-md flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <ImSpinner2 className="animate-spin h-5 w-5 mr-2" />
              ) : (
                'Create'
              )}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
