import * as nearApi from "near-api-js"; // make sure to install this package
import React, { useEffect, useState, useRef, useMemo } from "react";
import { useAccountId } from "near-social-vm";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import ReactMarkdown from 'react-markdown';
import { db, storage } from '../firebase'; // Adjust path accordingly
//import 'firebase/storage';

function PostCompose() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [markdownText, setMarkdownText] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const determineMediaType = (fileType) => {
	if (fileType.startsWith('image')) return 'image';
	if (fileType.startsWith('video')) return 'video';
	if (fileType.startsWith('audio')) return 'audio';
	return 'text';
  };

  const [mediaPreviews, setMediaPreviews] = useState([]);

  const handleFileChange = (event) => {
	  const files = Array.from(event.target.files);
	  setSelectedFiles(files);

	  const previews = files.map(file => {
		  if (file.type.startsWith('image')) {
			  return URL.createObjectURL(file);
		  } else if (file.type.startsWith('audio')) {
			  return URL.createObjectURL(file);
		  } else if (file.type.startsWith('video')) {
			  return URL.createObjectURL(file);
		  }
		  return null;
	  });

	  setMediaPreviews(previews);
  };
const mdeOptions = {
	  placeholder: 'Write your post in Markdown...'
  };

  const mdeComponent = useMemo(() => (
	<SimpleMDE
	  value={markdownText}
	  onChange={setMarkdownText}
	  options={mdeOptions}
	/>
  ), [markdownText]);

  const savePost = async () => {
	let uploadedURLs = [];

	// Determine media type based on first file (for simplicity)
	const mediaType = uploadedFiles[0] ? determineMediaType(uploadedFiles[0].type) : 'text';

	// Upload files to Firebase Storage
	for (let file of uploadedFiles) {
	  const fileRef = storage.ref().child(`posts_media/${file.name}`);
	  await fileRef.put(file);
	  const fileURL = await fileRef.getDownloadURL();
	  uploadedURLs.push(fileURL);
	  // Before unmounting the component or after upload
	  mediaPreviews.forEach(URL.revokeObjectURL);
	}

	// Save post to Firestore
	await db.collection('posts').add({
	  title,
	  description,
	  content: markdownText,
	  mediaType,
	  contentUrl: uploadedURLs[0], // Only saving the first file's URL for simplicity
	  isSigned: false, // Default to false; you can update this logic as needed
	  isExpiring: false, // Default to false; can update logic if you want
	  timestamp: firebase.firestore.FieldValue.serverTimestamp()
	});
	if (isSigned) {
	  	try {
			const userData = {
		  	data: {
				[currentUser]: { // Assuming `currentUser` contains the NEAR account ID of the logged-in user
			  	"post": {
					"title": title,
					"description": description,
					"content": markdownText,
					"mediaType": mediaType,
					"contentUrl": uploadedURLs[0]
			  	}
				}
		  	}
			};

			// Call the 'set' method on the SocialDB contract
			await contract.set(userData);

			alert('Post saved and signed on the blockchain!');
	  	} catch (error) {
			console.error('Failed to sign post on blockchain', error);
			alert('Failed to sign post on blockchain');
	  	}
		alert('Post saved!');
  	};
}
  return (
	<div className="post-compose">
	  <h2>Create a New Post</h2>

	  <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} /><br />
	  <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
	  <br />
	    {mdeComponent}
	 

	  <ReactMarkdown>{markdownText}</ReactMarkdown>
<div className="media-previews">
		  {mediaPreviews.map((preview, index) => {
			  const fileType = selectedFiles[index]?.type;

			  if (fileType?.startsWith('image')) {
				  return <img key={index} src={preview} alt="Preview" className="image-preview" />;
			  } else if (fileType?.startsWith('audio')) {
				  return (
					  <audio key={index} controls>
						  <source src={preview} type={fileType} />
						  Your browser does not support the audio element.
					  </audio>
				  );
			  } else if (fileType?.startsWith('video')) {
				  return (
					  <video key={index} controls className="video-preview">
						  <source src={preview} type={fileType} />
						  Your browser does not support the video tag.
					  </video>
				  );
			  }
			  return null;
		  })}
	  </div>

	  <input type="file" accept="image/*,video/*,audio/*" multiple onChange={handleFileChange} />

	  <button onClick={savePost}>
		Post
	  </button>
	</div>
  );
}

export default PostCompose;
