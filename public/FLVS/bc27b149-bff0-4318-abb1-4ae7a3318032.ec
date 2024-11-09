<?xml version="1.0" encoding="UTF-8"?>
<DuchampElementCaseWidget xmlVersion="20211223" releaseVersion="11.0.0">
<fontDependencies value="Source Han Sans-FVS Normal"/>
<ElementCaseEditor applyWithPXUnit="true">
<WidgetAttr aspectRatioLocked="false" aspectRatioBackup="-1.0" description="">
<MobileBookMark useBookMark="false" bookMarkName="" frozen="false" index="-1" oldWidgetName=""/>
<PrivilegeControl/>
</WidgetAttr>
<FollowingTheme borderStyle="false"/>
<Margin top="0" left="0" bottom="0" right="0"/>
<Border>
<border style="0" borderRadius="0" type="0" borderStyle="0">
<color>
<FineColor color="-723724" hor="-1" ver="-1"/>
</color>
</border>
<WidgetTitle>
<O>
<![CDATA[新建标题]]></O>
<FRFont name="SimSun" style="0" size="72"/>
<Position pos="0"/>
</WidgetTitle>
<Alpha alpha="1.0"/>
</Border>
<FormElementCase>
<ReportPageAttr>
<HR F="0" T="0"/>
<FR/>
<HC/>
<FC/>
<UPFCR COLUMN="false" ROW="true"/>
<USE REPEAT="false" PAGE="false" WRITE="false"/>
</ReportPageAttr>
<ColumnPrivilegeControl/>
<RowPrivilegeControl/>
<RowHeight defaultValue="723900">
<![CDATA[1524000,1188720,723900,723900,723900,723900,723900,723900,723900,723900,723900]]></RowHeight>
<ColumnWidth defaultValue="2743200">
<![CDATA[3200400,3543300,3276600,2743200,2743200,2743200,2743200,2743200,2743200,2743200,2743200]]></ColumnWidth>
<CellElementList>
<C c="0" r="0" s="0">
<O>
<![CDATA[时间]]></O>
<PrivilegeControl/>
<Expand>
<cellSortAttr/>
</Expand>
</C>
<C c="1" r="0" s="0">
<O>
<![CDATA[课程]]></O>
<PrivilegeControl/>
<Expand>
<cellSortAttr/>
</Expand>
</C>
<C c="2" r="0" s="0">
<O>
<![CDATA[教室]]></O>
<PrivilegeControl/>
<Expand/>
</C>
<C c="0" r="1" s="1">
<O t="DSColumn">
<Attributes dsName="实时课表" columnName="时间"/>
<Complex/>
<RG class="com.fr.report.cell.cellattr.core.group.FunctionGrouper"/>
<Parameters/>
<cellSortAttr/>
</O>
<PrivilegeControl/>
<HighlightList>
<Highlight class="com.fr.report.cell.cellattr.highlight.DefaultHighlight">
<Name>
<![CDATA[条件属性1]]></Name>
<Condition class="com.fr.data.condition.FormulaCondition">
<Formula>
<![CDATA[row()%2=0]]></Formula>
</Condition>
<HighlightAction class="com.fr.report.cell.cellattr.highlight.BackgroundHighlightAction">
<Scope val="1"/>
<Background name="ImageBackground" layout="2">
<FineImage fm="png" imageId="__ImageCache__A7A41C783A5F3EDF8A2F92AF3D07DFCF">
<IM>
<![CDATA[lO<9(kN.ld@UNU%p%320@UNSS!OB[(fRTc$iZgT/($Fi@(fE*Om?NBW#8A!b32@Q'1Z\G8J*
:VSX+:14pXD(rGn'Lla>3*B/C5NU,iHn.`8SMLfV-AoaJ.&$E.i`ahce\Xha:=+quk`li9BO
iZHanm#lj~
]]></IM>
</FineImage>
</Background>
</HighlightAction>
</Highlight>
</HighlightList>
<Expand dir="0">
<cellSortAttr/>
</Expand>
</C>
<C c="1" r="1" s="1">
<O t="DSColumn">
<Attributes dsName="实时课表" columnName="课程"/>
<Complex/>
<RG class="com.fr.report.cell.cellattr.core.group.FunctionGrouper"/>
<Parameters/>
<cellSortAttr/>
</O>
<PrivilegeControl/>
<Expand dir="0"/>
</C>
<C c="2" r="1" s="1">
<O t="DSColumn">
<Attributes dsName="实时课表" columnName="教室"/>
<Complex/>
<RG class="com.fr.report.cell.cellattr.core.group.FunctionGrouper"/>
<Parameters/>
<cellSortAttr/>
</O>
<PrivilegeControl/>
<Expand dir="0"/>
</C>
</CellElementList>
<ReportAttrSet>
<ReportSettings headerHeight="0" footerHeight="0">
<PaperSetting/>
<FollowingTheme background="true"/>
<Background name="ColorBackground">
<color>
<FineColor color="-1" hor="-1" ver="-1"/>
</color>
</Background>
</ReportSettings>
</ReportAttrSet>
</FormElementCase>
<StyleList>
<Style horizontal_alignment="0" imageLayout="1" paddingLeft="15">
<FRFont name="Source Han Sans-FVS Normal" style="0" size="80">
<foreground>
<FineColor color="-2116738" hor="-1" ver="-1"/>
</foreground>
</FRFont>
<Background name="ImageBackground" layout="2">
<FineImage fm="png" imageId="__ImageCache__A42CC215BD31FAFA1D60976138BA409A">
<IM>
<![CDATA[lO<9(kN.ld@UNU%p%320@UNSS!OB[(fRTc$iZgT/($Fi@(fE*Om1i")!t#GA*1eQ2AGXYT]A$
=OC^k]AhrB,Y&32a<CRLQCD#,)672@tu7\+cAZ+_\%G(#po[cL*QhPm$FGBr-1=IE=1&>##A;
bQZZ%09`P~
]]></IM>
</FineImage>
</Background>
<Border/>
</Style>
<Style horizontal_alignment="0" imageLayout="1">
<FRFont name="Source Han Sans-FVS Normal" style="0" size="80">
<foreground>
<FineColor color="-1" hor="-1" ver="-1"/>
</foreground>
</FRFont>
<Background name="ImageBackground" layout="2">
<FineImage fm="png" imageId="__ImageCache__A42CC215BD31FAFA1D60976138BA409A">
<IM>
<![CDATA[lO<9(kN.ld@UNU%p%320@UNSS!OB[(fRTc$iZgT/($Fi@(fE*Om1i")!t#GA*1eQ2AGXYT]A$
=OC^k]AhrB,Y&32a<CRLQCD#,)672@tu7\+cAZ+_\%G(#po[cL*QhPm$FGBr-1=IE=1&>##A;
bQZZ%09`P~
]]></IM>
</FineImage>
</Background>
<Border/>
</Style>
</StyleList>
<DesensitizationList/>
<heightRestrict heightrestrict="false"/>
<heightPercent heightpercent="0.75"/>
<ElementCaseMobileAttrProvider horizontal="1" vertical="1" zoom="true" refresh="false" isUseHTML="false" isMobileCanvasSize="false" appearRefresh="false" allowFullScreen="false" allowDoubleClickOrZoom="true" functionalWhenUnactivated="false"/>
<MobileFormCollapsedStyle class="com.fr.form.ui.mobile.MobileFormCollapsedStyle">
<collapseButton showButton="true" foldedHint="" unfoldedHint="" defaultState="0">
<color>
<FineColor color="-6710887" hor="-1" ver="-1"/>
</color>
</collapseButton>
<collapsedWork value="false"/>
<lineAttr number="1"/>
</MobileFormCollapsedStyle>
</ElementCaseEditor>
</DuchampElementCaseWidget>
