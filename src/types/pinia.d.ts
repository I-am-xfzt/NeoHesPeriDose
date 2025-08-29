declare type LayoutType = "vertical" | "classic" | "transverse" | "columns";

declare type AssemblySizeType = "large" | "default" | "small";

declare type LanguageType = "zh" | "en" | null;

/* GlobalState */
declare interface GlobalState {
    layout: LayoutType;
    assemblySize: AssemblySizeType;
    language: LanguageType;
    maximize: boolean;
    primary: string;
    isDark: boolean;
    isGrey: boolean;
    isWeak: boolean;
    asideInverted: boolean;
    headerInverted: boolean;
    isCollapse: boolean;
    accordion: boolean;
    watermark: boolean;
    breadcrumb: boolean;
    breadcrumbIcon: boolean;
    tabs: boolean;
    tabsIcon: boolean;
    footer: boolean;
}
// 用户信息
declare interface UserInfos {
	name: string;
	rolesArr: EmptyArrayType[];
	roles: string[];
	userName: string;
	roleName: string;
	deptId: number | null;
	deptName?: string;
	area: string | null;
	dept: EmptyObjectType;
	userId?: number;
	phonenumber: string,
	signUrl: string
}

/* UserState */
declare interface UserState {
    token: string;
    userInfo: UserInfos;
}

/* tabsMenuProps */
declare interface TabsMenuProps {
    icon: string;
    title: string;
    path: string;
    name: string;
    close: boolean;
    isKeepAlive: boolean;
}

/* TabsState */
declare interface TabsState {
    tabsMenuList: TabsMenuProps[];
}

/* AuthState */
declare interface AuthState {
    routeName: string;
    authButtonList: {
        [key: string]: string[];
    };
    authMenuList: Menu.MenuOptions[];
}

/* KeepAliveState */
declare interface KeepAliveState {
    keepAliveName: string[];
}
