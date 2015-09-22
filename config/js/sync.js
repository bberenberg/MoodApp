var ref = new Firebase("https://moodapp.firebaseio.com");
var postsRef = ref.child("user");
var newPostRef = postsRef.push();
newPostRef.set({
  date: Date.now(),
  score: "1",
  location: "lat= 39.0437 lon= -77.4875"
});
