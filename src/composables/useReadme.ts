import { ref } from "vue";
import { marked } from "marked";

export function useReadme() {
  const showReadmeModal = ref(false);
  const readmeHtmlContent = ref("");

  const loadReadme = async () => {
    if (readmeHtmlContent.value) return; // Already loaded

    try {
      const response = await fetch("/info.md");
      if (!response.ok) {
        throw new Error(`Failed to fetch info.md: ${response.statusText}`);
      }
      const markdownText = await response.text();
      const adjustedMarkdownText = markdownText.replace(/public\//g, "/");
      readmeHtmlContent.value = marked(adjustedMarkdownText) as string;
    } catch (error) {
      console.error("Error loading README:", error);
      readmeHtmlContent.value =
        "<p>Error loading README. Please try again later.</p>";
    }
  };

  const toggleReadmeModal = () => {
    showReadmeModal.value = !showReadmeModal.value;
    if (showReadmeModal.value && !readmeHtmlContent.value) {
      loadReadme();
    }
  };

  return {
    showReadmeModal,
    readmeHtmlContent,
    loadReadme,
    toggleReadmeModal,
  };
}
