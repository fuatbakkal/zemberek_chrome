/* global chrome, self */

﻿// Gelen mesajları dinle
chrome.runtime.onMessage.addListener(function(istek, gonderen, cevapla) {
	// popup.js'den kelime belirtme isteği gelirse
	if (istek.komut === 'kelimeleri_belirt') {
		var i = 0, j = 0;
		var kelimeler =  {};
		var frekanslar = {};
                
		while (i < istek.data.length && j < 5) {
			// Gelen kelime sayfada geçiyorsa belirt
			if (sayafada_ara(istek.data[i].kelime)) {
				$('body').highlight(istek.data[i].kelime);
				kelimeler[j] = istek.data[i].kelime;
				frekanslar[j] = istek.data[i].frekans;
				j++;
			}
			i++;
		}
                
		cevapla({
			sonuc : "Kelimeler belirtildi.",
			durum : true,
			kelimeler : kelimeler,
			frekanslar : frekanslar
		});
	}

	// popup.js'den kelime belirtmeyi kapatma isteği gelirse
	else if (istek.komut === 'belirtmeyi_kapat') {
		$('body').removeHighlight();
		cevapla({
			sonuc : "Kelime belirtme kapatıldı.",
			durum : false
		});
	}
});

// Sayafada kelime arama fonksiyonu
function sayafada_ara(kelime) {
	var bulunan_kelime = self.find(kelime);
	if (!bulunan_kelime) {
		bulunan_kelime = self.find(kelime, 0, 1);
		while (self.find(kelime, 0, 1)) {
			continue;
		}
	}
	if (!bulunan_kelime) {
		return false;
	}
	return true;
};

// Sayfada seçilen metni algıla
document.getSelected = function() {
	var metin = '';
	if (window.getSelection) {
		metin = window.getSelection();
	} else if (document.getSelection) {
		metin = document.getSelection();
	} else if (document.selection) {
		metin = document.selection.createRange().text;
	}
	return metin.toString();
};

// Farenin tuşu bırakılırsa seçilen metni
// background.js'e mesaj olarak gönder
document.mouseup = function() {
	var secilen_metin = document.getSelected();
	if (secilen_metin !== '') {
		chrome.runtime.sendMessage({
			komut : 'gonder',
			veri : secilen_metin
		});
	}
};

// Sayfa yüklendikten sonra yapılacaklar
$(document).ready(function() {
	// JavaScript 'mouseup' fonksiyonu yerine
	// jQuery 'mouseup' fonksiyonu kullan
	$(document).bind("mouseup", document.mouseup);
	// 'sayfa_yuklendi' mesajı gönder
	chrome.runtime.sendMessage({
		komut : 'sayfa_yuklendi'
            }, function(response) {
        });
});