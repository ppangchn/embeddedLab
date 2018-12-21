import firebase from 'firebase'

var config = {
	apiKey: 'AIzaSyD2zJXM_xgleflxMQ5X2q7WHHD3d7ufMws',
	authDomain: 'happypetguardian.firebaseapp.com',
	databaseURL: 'https://happypetguardian.firebaseio.com',
	projectId: 'happypetguardian',
	storageBucket: 'happypetguardian.appspot.com',
	messagingSenderId: '803455364603',
};
firebase.initializeApp(config);

export const database = firebase.database()
