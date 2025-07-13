import { ref, computed, watch } from "vue";
import { SinQuality, type ProfileData } from "../proto/profile.pb";

export function useLicenseManagement(formData: ProfileData) {
  const currentLicenseName = ref("");
  const currentLicenseQuality = ref<SinQuality>(SinQuality.SIN_QUALITY_LEVEL_1);
  const editingLicenseKey = ref<string | null>(null);
  const licenseQualityError = ref<string | null>(null);

  const isLicenseQualityInvalid = computed(() => {
    return currentLicenseQuality.value > formData.sinQuality;
  });

  watch([currentLicenseQuality, () => formData.sinQuality], () => {
    if (isLicenseQualityInvalid.value) {
      licenseQualityError.value =
        "A license cannot have a higher quality than the SIN itself.";
    } else {
      licenseQualityError.value = null;
    }
  });

  const addOrUpdateLicense = () => {
    if (!currentLicenseName.value.trim()) {
      alert("License name cannot be empty.");
      return;
    }

    if (isLicenseQualityInvalid.value) {
      // This check is redundant due to the watch, but good for safety
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
    currentLicenseQuality.value = SinQuality.SIN_QUALITY_LEVEL_1;
    editingLicenseKey.value = null;
  };

  const editLicense = (licenseName: string) => {
    if (!formData.licenses) return;
    currentLicenseName.value = licenseName;
    currentLicenseQuality.value =
      formData.licenses[licenseName] ?? SinQuality.SIN_QUALITY_UNSPECIFIED;
    editingLicenseKey.value = licenseName;
  };

  const deleteLicense = (licenseName: string) => {
    if (confirm(`Are you sure you want to delete license "${licenseName}"?`)) {
      if (!formData.licenses) return;
      delete formData.licenses[licenseName];
      if (editingLicenseKey.value === licenseName) {
        currentLicenseName.value = "";
        currentLicenseQuality.value = SinQuality.SIN_QUALITY_LEVEL_1;
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
    licenseQualityError,
    isLicenseQualityInvalid,
  };
}
