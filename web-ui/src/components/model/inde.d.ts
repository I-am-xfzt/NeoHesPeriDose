declare type ModelFilesNameType<T extends readonly string[]> = T[number]
declare type Tuple<T, N extends number> = N extends 0
  ? []
  : N extends 1
  ? [T]
  : N extends 2
  ? [T, T]
  : N extends 3
  ? [T, T, T]
  : never
declare type BabylonCameraNameType =
  | 'ArcRotateCamera'
  | 'FreeCamera'
  | 'UniversalCamera'
  | 'FollowCamera'
  | 'TargetCamera'
  | 'AnaglyphArcRotateCamera'
  | 'AnaglyphFreeCamera'
// 使用示例
declare type Vector3Tuple = Tuple<number, 3> // 这将生成一个包含3个string类型元素的元组类型

declare type loadModelOptionsType<T> = Array<[T, boolean, Vector3Tuple]>;