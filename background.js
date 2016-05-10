/* global chrome */

﻿// background.js ve popup.js tarafından
// kullanılacak global değişkenler
var durum = {}; // Her sekme için kelime belirtme durumunu kaydet
var kelimeler = {}; // Her sekmeye için kelimeleri
var frekanslar = {};// ve frekansları kaydet
var yeni_sekme = false;

// Yeni sekme açıldığında
chrome.tabs.onCreated.addListener(function(changeInfo) {
	yeni_sekme = true;
});

// Sekmelerde değişiklik olduğunda
// Yenileme, linke tıklama, yeni sekme oluşturma vb.
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	chrome.pageAction.show(tabId);
	// Sayfadaki bir linke farenin orta tuşuyla tıklanarak
	// yeni sekme açılmadıysa sayfa yenilenmiş/değişmiş demektir.
	// Bu durumda kelime belirtme kapatılır.
	if (changeInfo.status === 'complete' && !yeni_sekme) {
		chrome.tabs.query({
			active : true,
			currentWindow : true
		}, function(tabs) {
			durum[tabs[0].id] = false;
		});
	}
});

// Sekme aktif hale getirildiğinde
// Chrome eklentisi yeniden yüklenirse
//  sayfanın da yeniden yüklenmesi gerekiyor.
/* chrome.tabs.onActivated.addListener(function(changeInfo) {
	chrome.pageAction.show(changeInfo.tabId);
});
*/
chrome.runtime.onMessage.addListener(function(istek, gonderen, cevapla) {
	if (istek.komut === 'sayfa_yuklendi') {
		yeni_sekme = false;
	}

	if (istek.komut === 'gonder') {
		var xhttp = new XMLHttpRequest();
		console.log('Seçilen metin: ' + istek.veri);
		var veri = 'veri=' + istek.veri;
		xhttp.open('POST', 'http://127.0.0.1/post.php', true);
		xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhttp.send(veri);
		xhttp.onload = function() {
			console.log('Seçilen metin veritabanına gönderildi.');
		};
		return true;
	}
});