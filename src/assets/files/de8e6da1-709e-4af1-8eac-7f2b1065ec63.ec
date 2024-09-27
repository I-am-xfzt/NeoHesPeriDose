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
<USE REPEAT="true" PAGE="true" WRITE="false"/>
</ReportPageAttr>
<ColumnPrivilegeControl/>
<RowPrivilegeControl/>
<RowHeight defaultValue="723900">
<![CDATA[1066800,914400,723900,723900,723900,723900,723900,723900,723900,723900,723900]]></RowHeight>
<ColumnWidth defaultValue="2743200">
<![CDATA[3840480,4175760,3238500,2743200,2743200,2743200,2743200,2743200,2743200,2743200,2743200]]></ColumnWidth>
<CellElementList>
<C c="0" r="0" s="0">
<O>
<![CDATA[设备编号]]></O>
<PrivilegeControl/>
<Expand>
<cellSortAttr/>
</Expand>
</C>
<C c="1" r="0" s="0">
<O>
<![CDATA[设备名称]]></O>
<PrivilegeControl/>
<Expand/>
</C>
<C c="2" r="0" s="1">
<O>
<![CDATA[设备状态]]></O>
<PrivilegeControl/>
<Expand>
<cellSortAttr/>
</Expand>
</C>
<C c="0" r="1" s="2">
<O t="DSColumn">
<Attributes dsName="安防设备详情" columnName="设备编号"/>
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
<![CDATA[row() % 2 = 0]]></Formula>
</Condition>
<HighlightAction class="com.fr.report.cell.cellattr.highlight.BackgroundHighlightAction">
<Scope val="1"/>
<Background name="ColorBackground">
<color>
<FineColor color="-16048591" hor="-1" ver="-1"/>
</color>
</Background>
</HighlightAction>
</Highlight>
</HighlightList>
<Expand dir="0">
<cellSortAttr/>
</Expand>
</C>
<C c="1" r="1" s="2">
<O t="DSColumn">
<Attributes dsName="安防设备详情" columnName="设备名称"/>
<Complex/>
<RG class="com.fr.report.cell.cellattr.core.group.FunctionGrouper"/>
<Parameters/>
<cellSortAttr/>
</O>
<PrivilegeControl/>
<Expand dir="0"/>
</C>
<C c="2" r="1" s="3">
<O t="DSColumn">
<Attributes dsName="安防设备详情" columnName="设备状态"/>
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
<Condition class="com.fr.data.condition.ObjectCondition">
<Compare op="0">
<O>
<![CDATA[告警]]></O>
</Compare>
</Condition>
<HighlightAction class="com.fr.report.cell.cellattr.highlight.ForegroundHighlightAction">
<Scope val="1"/>
<Foreground>
<color>
<FineColor color="-26368" hor="-1" ver="-1"/>
</color>
</Foreground>
</HighlightAction>
</Highlight>
</HighlightList>
<Expand dir="0">
<cellSortAttr/>
</Expand>
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
<Style horizontal_alignment="0" imageLayout="1">
<FRFont name="Source Han Sans-FVS Normal" style="0" size="96">
<foreground>
<FineColor color="-1" hor="-1" ver="-1"/>
</foreground>
</FRFont>
<Background name="NullBackground"/>
<Border>
<Top>
<color>
<FineColor color="-9539986" hor="-1" ver="-1"/>
</color>
</Top>
<Bottom>
<color>
<FineColor color="-9539986" hor="-1" ver="-1"/>
</color>
</Bottom>
<Left>
<color>
<FineColor color="-9539986" hor="-1" ver="-1"/>
</color>
</Left>
<Right>
<color>
<FineColor color="-9539986" hor="-1" ver="-1"/>
</color>
</Right>
</Border>
</Style>
<Style horizontal_alignment="2" imageLayout="1">
<FRFont name="Source Han Sans-FVS Normal" style="0" size="96">
<foreground>
<FineColor color="-1" hor="-1" ver="-1"/>
</foreground>
</FRFont>
<Background name="NullBackground"/>
<Border>
<Top>
<color>
<FineColor color="-9539986" hor="-1" ver="-1"/>
</color>
</Top>
<Bottom>
<color>
<FineColor color="-9539986" hor="-1" ver="-1"/>
</color>
</Bottom>
<Left>
<color>
<FineColor color="-9539986" hor="-1" ver="-1"/>
</color>
</Left>
<Right>
<color>
<FineColor color="-9539986" hor="-1" ver="-1"/>
</color>
</Right>
</Border>
</Style>
<Style horizontal_alignment="0" imageLayout="1">
<FRFont name="Source Han Sans-FVS Normal" style="0" size="96">
<foreground>
<FineColor color="-5000269" hor="-1" ver="-1"/>
</foreground>
</FRFont>
<Background name="NullBackground"/>
<Border>
<Top>
<color>
<FineColor color="-9539986" hor="-1" ver="-1"/>
</color>
</Top>
<Bottom>
<color>
<FineColor color="-9539986" hor="-1" ver="-1"/>
</color>
</Bottom>
<Left>
<color>
<FineColor color="-9539986" hor="-1" ver="-1"/>
</color>
</Left>
<Right>
<color>
<FineColor color="-9539986" hor="-1" ver="-1"/>
</color>
</Right>
</Border>
</Style>
<Style horizontal_alignment="2" imageLayout="1" paddingLeft="14">
<FRFont name="Source Han Sans-FVS Normal" style="0" size="96">
<foreground>
<FineColor color="-5000269" hor="-1" ver="-1"/>
</foreground>
</FRFont>
<Background name="NullBackground"/>
<Border>
<Top>
<color>
<FineColor color="-9539986" hor="-1" ver="-1"/>
</color>
</Top>
<Bottom>
<color>
<FineColor color="-9539986" hor="-1" ver="-1"/>
</color>
</Bottom>
<Left>
<color>
<FineColor color="-9539986" hor="-1" ver="-1"/>
</color>
</Left>
<Right>
<color>
<FineColor color="-9539986" hor="-1" ver="-1"/>
</color>
</Right>
</Border>
</Style>
</StyleList>
<heightRestrict heightrestrict="false"/>
<heightPercent heightpercent="0.75"/>
<ReportFitAttr fitStateInPC="1" fitFont="false" minFontSize="0"/>
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
