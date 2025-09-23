export const handleSearch = <T = any>(Params: T[], Active: string, searchQuery: string): T[] => {
  return Params.filter(question => {
    const matchesSearch =
      question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = Active === "全部" || question.category === Active;
    return matchesSearch && matchesCategory;
  });
};
