# SIN Profile Data Structure Redesign Implementation

## Overview
You need to refactor a Vue.js Shadowrun SIN card application to use a new layered data structure that better aligns with the game's scan level system. The current implementation uses thematic groupings (basic, identity, physical, medical, employment, genetic) but should be changed to use scan-level-based groupings (level1 through level6).

## Current State Analysis
The application currently has:
- A Vue component (`IdCard.vue`) that displays SIN information in tabs
- A protobuf schema (`profile.proto`) defining the data structure
- Utility functions for profile management
- A scan level system that determines what information is visible

## Required Changes

### 1. Update Protocol Buffer Schema
Replace the existing `profile.proto` with the new layered structure:

```protobuf
// Use the new schema provided in the redesign artifact
// Key changes:
// - Replace thematic messages (ProfileBasic, ProfileIdentity, etc.) with level-based messages (SinLevel1, SinLevel2, etc.)
// - Each level contains the raw data available at that scan level
// - Remove computed/validated fields
// - Add seed-based generation support
```

### 2. Update Vue Component Logic
Modify `IdCard.vue` to work with the new data structure:

**Tab System Changes:**
- Change tab identifiers from `SinQuality.SIN_QUALITY_LEVEL_X` to match the new level structure
- Update tab content sections to pull from `level1`, `level2`, etc. instead of `basic`, `identity`, etc.
- Keep the licenses tab separate as requested

**Data Access Pattern:**
```javascript
// OLD: internalProfileData.value.basic.name
// NEW: internalProfileData.value.level2?.name

// OLD: internalProfileData.value.physical?.height
// NEW: internalProfileData.value.level4?.height
```

**Key Areas to Update:**
- Template sections for each scan level
- Computed properties accessing profile data
- Data generation logic using seeds
- Biometric display (now uses hashes instead of raw data)

### 3. Update Utility Functions
Modify profile-related utilities:

**`src/utils/profile.js` (or similar):**
- Update `getDefaultProfileData()` to return the new structure
- Modify any profile data mapping functions
- Update data generation to use the seed-based approach

**Data Generation Logic:**
- Use `base_seed` for consistent fake data generation
- Use `biometric_seed` for fingerprint/retinal hashes
- Use `background_seed` for employment/travel history
- Generate hashes instead of raw biometric data

### 4. Handle Missing Data Gracefully
Since the new structure uses optional fields:
- Use optional chaining (`?.`) when accessing nested level data
- Provide fallback values for missing information
- Only show tabs/sections for levels that have data

### 5. Update Display Logic
**Level 1 (Basic Identity Check):**
- Show only the photo
- Remove name, nationality, gender, metatype (these are Level 2)

**Level 2 (Core Identity Fields):**
- Show name, birthdate, birthplace, gender, metatype
- Move these from the current "basic" section

**Level 3 (All Printed Information):**
- Show full legal name, address, city, country, nationality, occupation
- Display datalinks as references (not computed data)

**Level 4 (Physical Biometrics):**
- Show physical characteristics (height, weight, eye/hair/skin color)
- Display biometric hashes instead of generated biometrics
- Consider showing hash values or "VERIFIED" indicators

**Level 5 (Deep Background):**
- Show employer, employer address
- List travel stamps, affiliation codes, education records, residence history
- Present as raw data lists, not computed records

**Level 6 (Genetic Markers):**
- Show blood type, DNA sequence hash
- Display genetic markers and medical alert codes
- Keep the DNA fingerprint visualization but base it on the hash

## Implementation Guidelines

### Data Migration Strategy
1. Create a migration function that converts old profile data to new structure
2. Map existing data to appropriate levels:
   - `basic` → `level1` + `level2` + `level3` (split appropriately)
   - `identity` → `level2` + `level3`
   - `physical` → `level4`
   - `medical` → `level6`
   - `employment` → `level5`
   - `genetic` → `level6`

### Seed-Based Generation
Replace current random generation with deterministic seed-based generation:
```javascript
// Use seeds to generate consistent fake data
const rand = new Rand(profileData.base_seed);
// Generate data that's consistent across app sessions
```

### Error Handling
- Handle cases where expected level data is missing
- Provide meaningful fallbacks for undefined fields
- Maintain backwards compatibility during transition

### Testing Considerations
- Test with SINs of different quality levels
- Verify that higher scan levels reveal more information
- Ensure licenses still work independently
- Test seed-based generation consistency

## Files to Modify
1. `src/proto/profile.proto` - Update schema
2. `src/components/IdCard.vue` - Main component logic
3. `src/utils/profile.js` - Profile utilities
4. Any profile generation or management utilities
5. Related composables that work with profile data

## Success Criteria
- [ ] New protobuf schema is implemented and working
- [ ] Vue component displays correct information per scan level
- [ ] Licenses remain separate and functional
- [ ] Seed-based generation produces consistent results
- [ ] No computed/validated data is displayed
- [ ] Biometric data shows as hashes, not raw data
- [ ] All scan levels work correctly with progressive disclosure
- [ ] No breaking changes to existing functionality

## Important Notes
- Keep the `active` field for gameplay purposes
- Maintain the existing UI/UX - only change the data structure
- Preserve the NFC scanning functionality
- Don't remove the licenses system - it should work independently
- Focus on raw data storage, not validation or computation
- Use optional chaining for all level data access