angular.module('starter.services').factory('Spreadsheet', function(Constants) {
	var header = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:html="http://www.w3.org/TR/REC-html40"> <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">  <Author>Reception</Author>  <LastAuthor>Reception</LastAuthor>  <Created>2016-03-03T22:22:55Z</Created>  <Company>Microsoft</Company>  <Version>14.00</Version> </DocumentProperties> <OfficeDocumentSettings xmlns="urn:schemas-microsoft-com:office:office">  <AllowPNG/> </OfficeDocumentSettings> <ExcelWorkbook xmlns="urn:schemas-microsoft-com:office:excel">  <WindowHeight>7740</WindowHeight>  <WindowWidth>20115</WindowWidth>  <WindowTopX>240</WindowTopX>  <WindowTopY>45</WindowTopY>  <ProtectStructure>False</ProtectStructure>  <ProtectWindows>False</ProtectWindows> </ExcelWorkbook> <Styles> <Style ss:ID="s62"><NumberFormat ss:Format="Short Date"/></Style> <Style ss:ID="Default" ss:Name="Normal">   <Alignment ss:Vertical="Bottom"/>   <Borders/>   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#000000"/>   <Interior/>   <NumberFormat/>   <Protection/>  </Style> </Styles> <Worksheet ss:Name="Reports">  ';
	var tableHeader = '<Table ss:ExpandedColumnCount="%colCount%" ss:ExpandedRowCount="%rowCount%" x:FullColumns="1"   x:FullRows="1" ss:DefaultRowHeight="15"> <Column ss:StyleID="s62" ss:Width="56.25" ss:Span="1"/>';
	var footer = '  </Table>  <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">   <PageSetup>    <Header x:Margin="0.3"/>    <Footer x:Margin="0.3"/>    <PageMargins x:Bottom="0.75" x:Left="0.7" x:Right="0.7" x:Top="0.75"/>   </PageSetup>   <Selected/>   <Panes>    <Pane>     <Number>3</Number>     <ActiveRow>5</ActiveRow>    </Pane>   </Panes>   <ProtectObjects>False</ProtectObjects>   <ProtectScenarios>False</ProtectScenarios>  </WorksheetOptions> </Worksheet></Workbook>';
	var fileName = 'DailyReport.xml';
	var timeString = 'T00:00:00.000';

	var saveData = function (data, filename) {
		var blob = new Blob([data], { type:"octet/stream" });
		var downloadLink = angular.element('<a></a>');
        downloadLink.attr('href',window.URL.createObjectURL(blob));
        downloadLink.attr('download', filename);
		downloadLink[0].click();
	};

	var createTable = function (data) {
	  	var rowCount = 0;
	  	var colCount = 0;
	  	var result = '';

	  	for (var row=0; row < data.length; row++) {

	   		rowCount = Math.max(rowCount, data.length);
	   	 	result += '<Row>';

	    	for (var col=0; col < data[row].length; col++) {

	      		colCount = Math.max(colCount, data[row].length);

	      		if (typeof data[row][col] === 'string' &&
	      			data[row][col].indexOf(timeString) >= 0) {

	      			result += '<Cell><Data ss:Type="DateTime">';

	      		} else {

	      			result += '<Cell><Data ss:Type="String">';
	      		}

	      		result += data[row][col];
	      		result += '</Data></Cell>';
	    	}

	    	result += '</Row>';
	  	}

	  	var headerTemplate = tableHeader.replace('%colCount%', colCount);
	  	var table = headerTemplate.replace('%rowCount%', rowCount);
	  	result = table + result;
	  	return result;
	};

	var createWorksheet = function (data) {
			return header + createTable(data) + footer;
	};

	var makeHeader = function () {
		return ['id', 
				'Date', 
				'Supervisor', 
				'Shift', 
				'Floor', 
				'incident',
				'Question', 
				'Description', 
				'Staff'];
	}

	var pushDate = function (data, audit) {
		var date = new Date(audit.date);
		var day = date.getDate();
		var month = date.getMonth() + 1;
		var year = date.getFullYear();
		var dateString = year + '-' 
			+ (month < 10 ? '0' + month : month) + '-' 
			+ (day   < 10 ? '0' + day   : day  ) + timeString;
		data.push(dateString);
	};

	var pushSupervisor = function (data, audit) {
		data.push(audit.supervisor.name);
		data.push(Constants.shifts[audit.supervisor.shift]);
		data.push(Constants.floors[audit.supervisor.floor]);
	};

	var pushReportTitle = function (data, report) {
		data.push(report.title);
	}

	var pushId = function (data, id) {
		data.push(id);
	}

	var pushIsIncident = function (data, isIncident) {
		data.push(isIncident);
	}

	var pushIncidentDesc = function (data, incidentDesc) {
		data.push(incidentDesc);
	}

	var pushStaffList = function (data, staffList) {
		for (var i = 0; i < staffList.length; i++)  {
			data.push(staffList[i].name);
		}
	}

	var pushNull = function (data) {
		data.push('');
	}

	var makeDataItem = function (audit, id, isIncident, report, incidentDesc, staffList) {
		var dataItem = [];
		if (id !== undefined) {
			pushId(dataItem, id);
		}
		pushDate(dataItem, audit);
		pushSupervisor(dataItem, audit);
		pushIsIncident(dataItem, isIncident);
		if (report) {
			pushReportTitle(dataItem, report);
		} else {
			pushNull(dataItem);
		}
		if (incidentDesc) {
			pushIncidentDesc(dataItem, incidentDesc);
		} else {
			pushNull(dataItem);
		}
		if (staffList) {
			pushStaffList(dataItem, staffList);
		}
		return dataItem;
	}

	var parseAudit = function (audit, id) {
		var data = [];
		var reports = audit.reports;
		var dataItem = makeDataItem(audit, id, false, null, null, audit.staffList);
		dataItem.push('');
		data.push(dataItem);
		for (var i = 0; i < reports.length; i++) {
			var report = reports[i];
			if (report.ok === false) {
				for (var j = 0; j < report.incidents.length; j++) {
					incident = report.incidents[j];
					var dataItem = makeDataItem(audit, id, true, report, incident.description, incident.staffList);
					data.push(dataItem);
				}
			}
		}
		return data;
	};

	var parseAudits = function (audits) {
		var data = [];
		data.push(makeHeader());
		for (var i = 0; i < audits.length; i++) {
			auditData = parseAudit(audits[i], i);
			data.push.apply(data, auditData);
		}
		return data;
	}

	return {

		downloadSpreadsheet: function (audits) {
			var data = parseAudits(audits);
			var worksheet = createWorksheet(data);
			saveData(worksheet, fileName);
		},
	};
});