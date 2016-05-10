/* global chrome */

// Loglar ve global değişkenler için gerekli
var bg = chrome.extension.getBackgroundPage();

// Popup açıldığında yapılacaklar
window.onload = function() {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		// Yeni sekme açıldığında
		if(bg.durum[tabs[0].id]===undefined) {
			bg.durum[tabs[0].id]=false;
		}
		// Sayfadaki kelimeler zaten belirtilmiş ise
		if(bg.durum[tabs[0].id]===true) {
			belirtme_acik(tabs[0].id);
		}
		// Kelime belirtme kapatılmış ise
		else if(bg.durum[tabs[0].id]===false) {
			belirtme_kapali();
		}
	});	
};

// Sayfadaki kelime belirtme durumuna göre
// buton işlevlerini değiştir
function belirtme_kapali() {
	$("#belirt_btn").off('click').on('click', kelimeleri_belirt);
	document.getElementById("belirt_btn").innerHTML = "Kelimeleri Belirt";
	document.getElementById("kelimeler_frekanslar").innerHTML = "";
};

function belirtme_acik(tabId) {
	$("#belirt_btn").off('click').on('click', belirtmeyi_kapat);
	document.getElementById("belirt_btn").innerHTML = "Kelime Belirtmeyi Kapat";
	document.getElementById("kelimeler_frekanslar").innerHTML = '<br /><table id="tablo"><tr id="tr_baslik"><th>Kelime</th><th>Frekans</th></tr></table>';
	for(var i=Object.keys(bg.kelimeler[tabId]).length - 1; i >= 0; i--) {
		$('#tr_baslik').after('<tr><th>' + bg.kelimeler[tabId][i] + '</th><th>' + bg.frekanslar[tabId][i] + '</th></tr>');
	}
};

function kelimeleri_belirt() {
	$.ajax({
		type: "GET",
		url: "http://127.0.0.1/get.php?kelimeler_frekanslar",
		datatype: "json",
		success: function(data, textStatus, xhr) {
			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
				chrome.tabs.sendMessage(tabs[0].id, { komut: 'kelimeleri_belirt', data }, function (gelen_yanit) {
					bg.durum[tabs[0].id] = gelen_yanit.durum;
					bg.kelimeler[tabs[0].id] = gelen_yanit.kelimeler;
					bg.frekanslar[tabs[0].id] = gelen_yanit.frekanslar;
					belirtme_acik(tabs[0].id);
					bg.console.log(gelen_yanit.sonuc);
				});
				chrome.pageAction.setIcon({tabId: tabs[0].id, path: 'img/16_aktif.png'});
			});
		}});
};

function belirtmeyi_kapat() {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { komut: 'belirtmeyi_kapat' }, function (gelen_yanit) {
			bg.durum[tabs[0].id] = gelen_yanit.durum;
			bg.console.log(gelen_yanit.sonuc);
		});
		chrome.pageAction.setIcon({tabId: tabs[0].id, path: 'img/16.png'});
	});
	belirtme_kapali();
};