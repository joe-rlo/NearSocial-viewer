import React, { useState, useEffect } from "react";
import PostCompose from '../components/dogpark/compose';

function OwnerPage() {
  return (
	<div>
	  <h1>This is the owner's page</h1>
	  <PostCompose />
	  {/* other components or content here */}
	</div>
  );
}

export default OwnerPage;

