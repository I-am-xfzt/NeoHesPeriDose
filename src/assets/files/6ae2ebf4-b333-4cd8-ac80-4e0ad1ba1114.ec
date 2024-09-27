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
<HR/>
<FR/>
<HC/>
<FC/>
<USE REPEAT="false" PAGE="false" WRITE="false"/>
</ReportPageAttr>
<ColumnPrivilegeControl/>
<RowPrivilegeControl/>
<RowHeight defaultValue="723900">
<![CDATA[2407920,1371600,2407920,1371600,723900,723900,723900,723900,723900,723900,723900]]></RowHeight>
<ColumnWidth defaultValue="2743200">
<![CDATA[2324100,2743200,2743200,2743200,2743200,2743200,2743200,2743200,2743200,2743200,2743200]]></ColumnWidth>
<CellElementList>
<C c="0" r="0" s="0">
<O t="DSColumn">
<Attributes dsName="系统监测-灯" columnName="楼栋"/>
<Condition class="com.fr.data.condition.CommonCondition">
<CNUMBER>
<![CDATA[0]]></CNUMBER>
<CNAME>
<![CDATA[楼栋]]></CNAME>
<Compare op="0">
<Parameter>
<Attributes name="a"/>
<O>
<![CDATA[]]></O>
</Parameter>
</Compare>
</Condition>
<Complex/>
<RG class="com.fr.report.cell.cellattr.core.group.FunctionGrouper"/>
<Result>
<![CDATA[$$$]]></Result>
<Parameters/>
<cellSortAttr>
<sortExpressions/>
</cellSortAttr>
</O>
<PrivilegeControl/>
<Expand>
<cellSortAttr>
<sortExpressions/>
<sortHeader sortArea="B1"/>
</cellSortAttr>
</Expand>
</C>
<C c="1" r="0" s="0">
<O>
<![CDATA[灯]]></O>
<PrivilegeControl/>
<Expand>
<cellSortAttr/>
</Expand>
</C>
<C c="2" r="0" s="0">
<O>
<![CDATA[空调]]></O>
<PrivilegeControl/>
<Expand>
<cellSortAttr/>
</Expand>
</C>
<C c="3" r="0" s="0">
<O>
<![CDATA[供排水]]></O>
<PrivilegeControl/>
<Expand>
<cellSortAttr/>
</Expand>
</C>
<C c="4" r="0" s="0">
<O>
<![CDATA[供配电]]></O>
<PrivilegeControl/>
<Expand>
<cellSortAttr/>
</Expand>
</C>
<C c="0" r="1" s="1">
<O>
<![CDATA[故障]]></O>
<PrivilegeControl/>
<Expand>
<cellSortAttr/>
</Expand>
</C>
<C c="1" r="1" s="1">
<O t="DSColumn">
<Attributes dsName="系统监测-灯" columnName="故障"/>
<Complex/>
<RG class="com.fr.report.cell.cellattr.core.group.SummaryGrouper">
<FN>
<![CDATA[com.fr.data.util.function.SumFunction]]></FN>
</RG>
<Parameters/>
<cellSortAttr/>
</O>
<PrivilegeControl/>
<Expand leftParentDefault="false" left="A1">
<cellSortAttr>
<sortExpressions/>
<sortHeader sortArea="C2"/>
</cellSortAttr>
</Expand>
</C>
<C c="2" r="1" s="1">
<O t="DSColumn">
<Attributes dsName="系统监测-空调" columnName="故障"/>
<Complex/>
<RG class="com.fr.report.cell.cellattr.core.group.SummaryGrouper">
<FN>
<![CDATA[com.fr.data.util.function.SumFunction]]></FN>
</RG>
<Parameters/>
<cellSortAttr/>
</O>
<PrivilegeControl/>
<Expand leftParentDefault="false" left="A1">
<cellSortAttr>
<sortExpressions/>
<sortHeader sortArea="C2"/>
</cellSortAttr>
</Expand>
</C>
<C c="3" r="1" s="1">
<O t="DSColumn">
<Attributes dsName="系统监测-供排水" columnName="故障"/>
<Complex/>
<RG class="com.fr.report.cell.cellattr.core.group.SummaryGrouper">
<FN>
<![CDATA[com.fr.data.util.function.SumFunction]]></FN>
</RG>
<Parameters/>
<cellSortAttr/>
</O>
<PrivilegeControl/>
<Expand leftParentDefault="false" left="A1">
<cellSortAttr>
<sortExpressions/>
<sortHeader sortArea="C2"/>
</cellSortAttr>
</Expand>
</C>
<C c="4" r="1" s="1">
<O t="DSColumn">
<Attributes dsName="系统监测-供配电" columnName="故障"/>
<Complex/>
<RG class="com.fr.report.cell.cellattr.core.group.SummaryGrouper">
<FN>
<![CDATA[com.fr.data.util.function.SumFunction]]></FN>
</RG>
<Parameters/>
<cellSortAttr/>
</O>
<PrivilegeControl/>
<Expand leftParentDefault="false" left="A1">
<cellSortAttr>
<sortExpressions/>
<sortHeader sortArea="C2"/>
</cellSortAttr>
</Expand>
</C>
<C c="0" r="2" s="0">
<O>
<![CDATA[开]]></O>
<PrivilegeControl/>
<Expand>
<cellSortAttr/>
</Expand>
</C>
<C c="1" r="2" s="0">
<O t="DSColumn">
<Attributes dsName="系统监测-灯" columnName="开"/>
<Complex/>
<RG class="com.fr.report.cell.cellattr.core.group.SummaryGrouper">
<FN>
<![CDATA[com.fr.data.util.function.SumFunction]]></FN>
</RG>
<Parameters/>
<cellSortAttr/>
</O>
<PrivilegeControl/>
<Expand leftParentDefault="false" left="A1">
<cellSortAttr>
<sortExpressions/>
<sortHeader sortArea="C2"/>
</cellSortAttr>
</Expand>
</C>
<C c="2" r="2" s="0">
<O t="DSColumn">
<Attributes dsName="系统监测-空调" columnName="开"/>
<Complex/>
<RG class="com.fr.report.cell.cellattr.core.group.SummaryGrouper">
<FN>
<![CDATA[com.fr.data.util.function.SumFunction]]></FN>
</RG>
<Parameters/>
<cellSortAttr/>
</O>
<PrivilegeControl/>
<Expand leftParentDefault="false" left="A1">
<cellSortAttr>
<sortExpressions/>
<sortHeader sortArea="C2"/>
</cellSortAttr>
</Expand>
</C>
<C c="3" r="2" s="0">
<O t="DSColumn">
<Attributes dsName="系统监测-供排水" columnName="开"/>
<Complex/>
<RG class="com.fr.report.cell.cellattr.core.group.SummaryGrouper">
<FN>
<![CDATA[com.fr.data.util.function.SumFunction]]></FN>
</RG>
<Parameters/>
<cellSortAttr/>
</O>
<PrivilegeControl/>
<Expand leftParentDefault="false" left="A1">
<cellSortAttr>
<sortExpressions/>
<sortHeader sortArea="C2"/>
</cellSortAttr>
</Expand>
</C>
<C c="4" r="2" s="0">
<O t="DSColumn">
<Attributes dsName="系统监测-供配电" columnName="开"/>
<Complex/>
<RG class="com.fr.report.cell.cellattr.core.group.SummaryGrouper">
<FN>
<![CDATA[com.fr.data.util.function.SumFunction]]></FN>
</RG>
<Parameters/>
<cellSortAttr/>
</O>
<PrivilegeControl/>
<Expand leftParentDefault="false" left="A1">
<cellSortAttr>
<sortExpressions/>
<sortHeader sortArea="C2"/>
</cellSortAttr>
</Expand>
</C>
<C c="0" r="3" s="1">
<O>
<![CDATA[关]]></O>
<PrivilegeControl/>
<Expand>
<cellSortAttr/>
</Expand>
</C>
<C c="1" r="3" s="1">
<O t="DSColumn">
<Attributes dsName="系统监测-灯" columnName="关"/>
<Complex/>
<RG class="com.fr.report.cell.cellattr.core.group.SummaryGrouper">
<FN>
<![CDATA[com.fr.data.util.function.SumFunction]]></FN>
</RG>
<Parameters/>
<cellSortAttr/>
</O>
<PrivilegeControl/>
<Expand leftParentDefault="false" left="A1">
<cellSortAttr>
<sortExpressions/>
<sortHeader sortArea="C2"/>
</cellSortAttr>
</Expand>
</C>
<C c="2" r="3" s="1">
<O t="DSColumn">
<Attributes dsName="系统监测-空调" columnName="关"/>
<Complex/>
<RG class="com.fr.report.cell.cellattr.core.group.SummaryGrouper">
<FN>
<![CDATA[com.fr.data.util.function.SumFunction]]></FN>
</RG>
<Parameters/>
<cellSortAttr/>
</O>
<PrivilegeControl/>
<Expand leftParentDefault="false" left="A1">
<cellSortAttr>
<sortExpressions/>
<sortHeader sortArea="C2"/>
</cellSortAttr>
</Expand>
</C>
<C c="3" r="3" s="1">
<O t="DSColumn">
<Attributes dsName="系统监测-供排水" columnName="关"/>
<Complex/>
<RG class="com.fr.report.cell.cellattr.core.group.SummaryGrouper">
<FN>
<![CDATA[com.fr.data.util.function.SumFunction]]></FN>
</RG>
<Parameters/>
<cellSortAttr/>
</O>
<PrivilegeControl/>
<Expand leftParentDefault="false" left="A1">
<cellSortAttr>
<sortExpressions/>
<sortHeader sortArea="C2"/>
</cellSortAttr>
</Expand>
</C>
<C c="4" r="3" s="1">
<O t="DSColumn">
<Attributes dsName="系统监测-供配电" columnName="关"/>
<Complex/>
<RG class="com.fr.report.cell.cellattr.core.group.SummaryGrouper">
<FN>
<![CDATA[com.fr.data.util.function.SumFunction]]></FN>
</RG>
<Parameters/>
<cellSortAttr/>
</O>
<PrivilegeControl/>
<Expand leftParentDefault="false" left="A1">
<cellSortAttr>
<sortExpressions/>
<sortHeader sortArea="C2"/>
</cellSortAttr>
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
<FineColor color="-6572076" hor="-1" ver="-1"/>
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
<FineColor color="-14244131" hor="-1" ver="-1"/>
</foreground>
</FRFont>
<Background name="ColorBackground">
<color>
<FineColor color="-15784898" hor="-1" ver="-1"/>
</color>
</Background>
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
<ReportFitAttr fitStateInPC="2" fitFont="false" minFontSize="0"/>
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
