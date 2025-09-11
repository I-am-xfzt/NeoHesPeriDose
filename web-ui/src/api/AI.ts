export const connectionStatus = async (): Promise<boolean> => {
  const response = await fetch("/chart-api/providers");
  const data = await response.json();
  return data.data?.available?.includes("zhipu") || true;
};
interface chartMsg {
  message: string;
  options: {
    model: string;
    systemPrompt: string;
  };
}
export const getChartMsg = async (params: chartMsg): Promise<string> => {
  const response = await fetch("/chart-api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params)
  });

  const data = await response.json();
  if (data.success) {
    return data.content as string;
  } else {
    throw new Error(data.error);
  }
};

export const getAnalyzeFile = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const fileObject = {
    buffer: Array.from(new Uint8Array(buffer)),
    originalname: file.name,
    size: file.size,
    mimetype: file.type
  };

  // 发送请求
  const response = await fetch("/chart-api/analyze-file", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      file: fileObject,
      options: {
        toolType: "lite"
      }
    })
  });
  return await response.json();
};
