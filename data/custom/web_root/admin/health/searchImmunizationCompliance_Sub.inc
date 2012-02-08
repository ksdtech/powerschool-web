<!-- start of content and bounding box -->
<table border="0" cellspacing="0" cellpadding="0" align="center">
<tr>
<td colspan="2" background="/images/bond_3000_top.gif" align="right"><img src="/images/bound_box_top_right1.gif" width="15" height="9" alt="" border="0"></td>
<td width="25"><img src="/images/bound_box_top_right2.gif" width="25" height="9" alt="" border="0"></td>
</tr>
<tr>
<td width="23" background="/images/bond_box_left_edge.gif"><img src="/images/spacer.gif" width="23" height="1"></td>
<td>

<div id="contentright">


<table border="0" cellspacing="0" cellpadding="4">
<tr bgcolor="#f6f6f6">
<td class="bold">Option</td>
<td class="bold">Value</td>
</tr>
<tr bgcolor="#edf3fe">
<td class="bold">Students</td>
<td>	
<input type="radio" name="forwhichstudents" id="forwhichstudents" value="all" checked> All active students in ~(schoolname)<br>
<input type="radio" name="forwhichstudents" id="forwhichstudents" value="selected" > The selected ~[x:studsinset] students
</td>
</tr>
<tr bgcolor="#FFFFFF">
<td class="bold">Vaccine</td>
<td>
<input type="radio" name="vaccine" id="vaccine" onchange="setVaccineDropdown('any');" value="any" checked> Any mandatory vaccine<br
<input type="radio" name="vaccine" id="vaccine" onchange="setVaccineDropdown('selected');" value="selected" checked> Only this vaccine: 
<select name="optvaccine" id="optvaccine" onchange="selectVaccine()">
	~[brij_render:health;:SelectImmComplianceSearch]
</select>
</td>
</tr>
<tr bgcolor="#edf3fe">
<td class="bold">Compliance</td>
<td>

	<input type="radio" name="compliance" value="1" checked> Not Compliant<br>
	<input type="radio" name="compliance" value="0" > Compliant<br>
	<input type="radio" name="compliance" value="" > Any
</td>
</tr>
<tr bgcolor="#FFFFFF">
<td class="bold">Exemption</td>
<td>
	<input type="radio" name="exempt" value="0" checked> Not Exempt<br>
	<input type="radio" name="exempt" value="1" > Exempt<br>
	<input type="radio" name="exempt" value="" > Any
	
	</td>
</tr>
<tr bgcolor="#edf3fe">
<td class="bold">Doses</td>
<td>
fewer than: <input type="text" name="doses" value="" maxlength="10" width="5" style="width:5em;" onkeyup="javascript:this.value=this.value.replace(/[^0-9]/g, '');">
</td>

</tr>
<tr><td colspan="2">
       
<img src="/images/linestyle1.gif" alt="" align="middle" vspace="2" width="400" height="1"><br /></td></tr>

<tr><td colspan="2" width="400" >
Selecting "Any mandatory vaccine" will return students who meet the compliance, exemption, and dose (if specified) parameters for any immunization record.
<p />
Selecting "Only this vaccine" will return students who meet the compliance, exemption, and dose (if specified) parameters for the immunization record associated with the specified vaccine.
</td></tr>

</table>

</div>

<br>

</td>
<td width="25" background="/images/bond_box_right_edge.gif"><img src="/images/spacer.gif" width="25" height="1"></td>
</tr>
<tr>
<td colspan="2" background="/images/bond_3000_bot.gif" align="right"><img src="/images/bound_box_bot_right1.gif" width="15" height="12" alt="" border="0"></td>
<td width="25"><img src="/images/bound_box_bot_right2.gif" width="25" height="12" alt="" border="0"></td>
</tr>
<tr>
<td colspan="2" align="right"><input type="hidden" name="ac" value="healthimmcompliancesearch">~[submitbutton]
</td>
<td>&nbsp;</td>
</tr>
</table>

<br>
<!-- end of content of bounding box -->
