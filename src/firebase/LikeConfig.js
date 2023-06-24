import { firestore } from './firebaseConfig'; 

const updateLikeCount = async (postId) => {
  const collectionRef = firestore.collection('posts');
  const docRef = collectionRef.doc(postId);

  try {
    const doc = await docRef.get();

    if (doc.exists) {
      const currentLikeCount = doc.data().likeCount || 0;
      const newLikeCount = currentLikeCount + 1;

      await docRef.update({ likeCount: newLikeCount });

      console.log('likeCount updated successfully.');
    } else {
      console.log('Document does not exist.');
    }
  } catch (error) {
    console.error('Error updating likeCount:', error);
  }
};

updateLikeCount('<post-id>');
