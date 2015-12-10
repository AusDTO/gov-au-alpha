			function OpenPortalWindow(href, windowName)
			{
				var newWindow;
				document.cookie = "SessionId =; expires=Fri, 31 Dec 1999 23:59:59 GMT;"
				if (navigator.platform.toLowerCase().indexOf('mac') > -1)
						document.cookie = "ATOSessionCookie =; expires=Fri, 31 Dec 1999 23:59:59 GMT;";
				else
						document.cookie = "ATOSessionCookie =;path=/";
				document.cookie = "ASP.NET_SessionId =; expires=Fri, 31 Dec 1999 23:59:59 GMT;";
				newWindow = window.open(href, windowName, "toolbar=no, status=yes, resizable=yes, scrollbars=yes");
				newWindow.focus();
			}