

var myAuto;
function initMusic() {
	myAuto = document.getElementById('myaudio');
}
function autoPlay() {
		myAuto.play();
        }
function closePlay() {
        myAuto.pause();
        myAuto.load();
    }