import React from 'react';
import { useParams } from 'react-router';

function UploaderPage() {
  const { uploaderName } = useParams();

  return (
    <div>
      <h2>Uploader Page</h2>
      <p>Uploader Name: {uploaderName}</p>
      {/* Add the desired content for the uploader's page */}
    </div>
  );
}

export default UploaderPage;
