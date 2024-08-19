import { useCallback, useState } from "react";
import PropTypes from 'prop-types';
import { useDropzone } from "react-dropzone";

import { convertFileToUrl } from "@/lib/utils";

/**
 * ProfileUploader component
 * @param {Object} props
 * @param {Function} props.fieldChange - Function to handle file change
 * @param {string} props.mediaUrl - Current media URL
 * @returns {JSX.Element}
 */
const ProfileUploader = ({ fieldChange, mediaUrl }) => {
  const [file, setFile] = useState([]);
  const [fileUrl, setFileUrl] = useState(mediaUrl);

  const onDrop = useCallback(
    (acceptedFiles) => {
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(convertFileToUrl(acceptedFiles[0]));
    },
    [file]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
    },
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} className="cursor-pointer" />

      <div className="cursor-pointer flex-center gap-4">
        <img
          src={fileUrl || "/assets/icons/profile-placeholder.svg"}
          alt="image"
          className="h-24 w-24 rounded-full object-cover object-top"
        />
        <p className="text-primary-500 small-regular md:bbase-semibold">
          Change profile photo
        </p>
      </div>
    </div>
  );
};

ProfileUploader.propTypes = {
  fieldChange: PropTypes.func.isRequired,
  mediaUrl: PropTypes.string.isRequired,
};

export default ProfileUploader;