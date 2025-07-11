import { ref } from "vue";
import type { ProfileData } from "../@types/profile";
import { SinQuality, type SinQualityValue } from "../components/sin-quality";

export function useLicenseManagement(formData: ProfileData) {
  const currentLicenseName = ref("");
  const currentLicenseQuality = ref<SinQualityValue>(SinQuality.LEVEL_1);
  const editingLicenseKey = ref<string | null>(null);

  const addOrUpdateLicense = () => {
    if (!currentLicenseName.value.trim()) {
      alert("License name cannot be empty.");
      return;
    }
    const name = currentLicenseName.value.trim();
    if (!formData.licenses) {
      formData.licenses = {};
    }
    if (editingLicenseKey.value && editingLicenseKey.value !== name) {
      delete formData.licenses[editingLicenseKey.value];
    }
    formData.licenses[name] = currentLicenseQuality.value;
    currentLicenseName.value = "";
    currentLicenseQuality.value = SinQuality.LEVEL_1;
    editingLicenseKey.value = null;
  };

  const editLicense = (licenseName: string) => {
    if (!formData.licenses) return;
    currentLicenseName.value = licenseName;
    currentLicenseQuality.value = formData.licenses[licenseName];
    editingLicenseKey.value = licenseName;
  };

  const deleteLicense = (licenseName: string) => {
    if (confirm(`Are you sure you want to delete license "${licenseName}"?`)) {
      if (!formData.licenses) return;
      delete formData.licenses[licenseName];
      if (editingLicenseKey.value === licenseName) {
        currentLicenseName.value = "";
        currentLicenseQuality.value = SinQuality.LEVEL_1;
        editingLicenseKey.value = null;
      }
    }
  };

  return {
    currentLicenseName,
    currentLicenseQuality,
    editingLicenseKey,
    addOrUpdateLicense,
    editLicense,
    deleteLicense,
  };
}
