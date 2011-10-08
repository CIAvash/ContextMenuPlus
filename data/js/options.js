$(function() {
	
	var options, cttOldHotkey, cpuOldHotkey;
	function checkOptions(opts) {
		$("#cpageTitle").prop("checked", opts.cpageTitle);
		$("#cpageurl").prop("checked", opts.cpageurl);
		$("#cpAsHtmlLink").prop("checked", opts.cpAsHtmlLink);
		$("#opageHostname").prop("checked", opts.opageHostname);
		$("#cplaintext").prop("checked", opts.cplaintext);
		$("#cAsHtmlCode").prop("checked", opts.cAsHtmlCode);
		$("#clinkText").prop("checked", opts.clinkText);
		$("#olinkHostname").prop("checked", opts.olinkHostname);
		$("#ctextTitleHotKey").prop("checked", opts.ctextTitleHotKey);
		$("#cttHotkey").val(opts.ctextTitleKey);
		$("#cttHotkey").prop('disabled', !opts.ctextTitleHotKey);
		cttOldHotkey = opts.ctextTitleKey;
		$("#cpageurlHotkey").prop("checked", opts.cpageurlHotkey);
		$("#cpuHotkey").val(opts.cpageurlkey);
		$("#cpuHotkey").prop('disabled', !opts.cpageurlHotkey);
		cpuOldHotkey = opts.cpageurlkey;
		options = opts;
	}
	
	function notify(msg, msgType) {
		if(msgType === 'normal') {
			$("#notification").css('background', '#4E9E0E');
		} else if(msgType === 'error') {
			$("#notification").css('background', '#C62C01');
		}
		$("#notification").text(msg).stop(true, true).fadeIn().delay(1500).fadeOut();
	}
	
    self.port.on("options", checkOptions);
	
	var hotkeyPat = /[a-zA-Z0-9]/;
	$("#cttHotkey").keypress(function() {
		$(this).val('');
	});
	$("#cttHotkey").keyup(function() {
		if(!hotkeyPat.test($(this).val())) {
			$(this).val('');
		}
	});
	$("#ctextTitleHotKey").click(function() {
		$("#cttHotkey").prop('disabled', !$(this).is(':checked'));
	});
	$("#cpuHotkey").keypress(function() {
		$(this).val('');
	});
	$("#cpuHotkey").keyup(function() {
		if(!hotkeyPat.test($(this).val())) {
			$(this).val('');
		}
	});
	$("#cpageurlHotkey").click(function() {
		$("#cpuHotkey").prop('disabled', !$(this).is(':checked'));
	});

	var conflict;
    $('#save_btn').click(function() {
    	if($("#cpageTitle").is(':checked')) {
    		options.cpageTitle = true;
    	} else { options.cpageTitle = false; }
    	if($("#cpageurl").is(':checked')) {
    		options.cpageurl = true;
    	} else { options.cpageurl = false; }
    	if($("#cpAsHtmlLink").is(':checked')) {
    		options.cpAsHtmlLink = true;
    	} else { options.cpAsHtmlLink = false; }
    	if($("#opageHostname").is(':checked')) {
    		options.opageHostname = true;
    	} else { options.opageHostname = false; }
    	if($("#cplaintext").is(':checked')) {
    		options.cplaintext = true;
    	} else { options.cplaintext = false; }
    	if($("#cAsHtmlCode").is(':checked')) {
    		options.cAsHtmlCode = true;
    	} else { options.cAsHtmlCode = false; }
    	if($("#clinkText").is(':checked')) {
    		options.clinkText = true;
    	} else { options.clinkText = false; }
    	if($("#olinkHostname").is(':checked')) {
    		options.olinkHostname = true;
    	} else { options.olinkHostname = false; }
    	if($("#ctextTitleHotKey").is(':checked')) {
    		options.ctextTitleHotKey = true;
    	} else { options.ctextTitleHotKey = false; }
	    if($("#cpageurlHotkey").is(':checked')) {
    		options.cpageurlHotkey = true;
    	} else { options.cpageurlHotkey = false; }
   		if(($("#cttHotkey").val() === $("#cpuHotkey").val())) {
   			conflict = true;
   		} else {
   			conflict = false;
   		}
    	if(!conflict) {
			if(($("#cttHotkey").val() !== cttOldHotkey) && ($("#ctextTitleHotKey").is(':checked'))) {	//new hotkey
				options.ctextTitleKey = $("#cttHotkey").val();
				options.ctextTitleKeyChanged = true;
			}
			if(($("#cpuHotkey").val() !== cpuOldHotkey) && ($("#cpageurlHotkey").is(':checked'))) {	//new hotkey
				options.cpageurlkey = $("#cpuHotkey").val();
				options.cpageurlkeyChanged = true;
			}
		} else {
			notify('Shortcut keys conflict', 'error');
		}
    	self.port.emit("options", options);
    	if(!conflict) {
    		notify('Options saved', 'normal');
    	}
    });
});
