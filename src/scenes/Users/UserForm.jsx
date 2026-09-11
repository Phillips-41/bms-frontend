import { useEffect, useState } from "react";
import { fetchAllCircles, fetchAllDivisions, fetchAllZones, fetchAreaNames } from "../../services/apiService";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Select,
  Chip,
Autocomplete,
  FormGroup,
  FormControlLabel,
  Checkbox,
 Grid
} from "@mui/material";
import { PAGES } from ".";


const UserForm = ({
  open,
  handleClose,
  handleSubmit,
  roles,
  userError,
  isEditing,
  colors,
  textFieldStyles,
  buttonGradient,
  stateOptions, // Array of { id: 1, name: "AP" }
  viewMode,formData, setFormData
}) => {
  const [locationIds, setLocationIds] = useState({
        stateId: null,
        zoneId: null,
        circleId: null,
        divisionId: null,
        areaIds: [] // Array of objects {id, name}
    });

    // 2. State for managing all dynamically loaded options (Zones, Circles, etc.)
    const [options, setOptions] = useState({
        zones: [],
        circles: [],
        divisions: [],
        areas: []
    });

    // 3. State for holding the list of all access rules for the user (loaded from formData.accessRules)
    const [accessRulesList, setAccessRulesList] = useState([]);
    
    // 4. State for selecting which existing rule to edit (if multiple exist)
    const [selectedRuleIndex, setSelectedRuleIndex] = useState(null);


    // ----------------------------------------------------------------------------------
    // 🧠 EFFECT HOOK: LOAD DATA ON MODAL OPEN/FORM CHANGE
    // ----------------------------------------------------------------------------------
    useEffect(() => {
        if (open) {
            // Load the array of access rules from props
            const rules = formData.accessRules || [];
            setAccessRulesList(rules);
            
            // Set the first rule for display/editing if it exists, otherwise reset for new input
            if (rules.length > 0) {
                const firstRule = rules[0];
                setSelectedRuleIndex(0);
                
                // Initialize the locationIds state with the first rule's data
                setLocationIds({
                    stateId: firstRule.stateId || 'ALL',
                    zoneId: firstRule.zoneId || 'ALL',
                    circleId: firstRule.circleId || 'ALL',
                    divisionId: firstRule.divisionId || 'ALL',
                    // Areas need careful handling: if areaId is null, it means "All Areas"
                    areaIds: firstRule.areaId ? [ { id: firstRule.areaId, name: firstRule.areaName } ] : [],
                });
                
                // CRITICAL: Pre-fetch downstream options to make the dropdowns clickable
                // This simulates the cascading effect for the initial loaded rule
                loadOptionsForRule(firstRule);

            } else {
                // Default state for adding a new user or a new rule
                setSelectedRuleIndex(null);
                setLocationIds({ stateId: null, zoneId: null, circleId: null, divisionId: null, areaIds: [] });
                setOptions({ zones: [], circles: [], divisions: [], areas: [] });
            }
        }
    }, [open, formData.accessList]); 
    // Dependency on formData.accessRules ensures it reloads if the user data changes outside this modal

    // Helper function to pre-fetch options based on a given rule object
    const loadOptionsForRule = async (rule) => {
        try {
            const newOptions = { zones: [], circles: [], divisions: [], areas: [] };
            
            // 1. Fetch Zones if State is defined
            if (rule.stateName) {
                newOptions.zones = await fetchAllZones(rule.stateName) || [];
            }
            // 2. Fetch Circles if Zone is defined
            if (rule.zoneName) {
                newOptions.circles = await fetchAllCircles(rule.zoneName) || [];
            }
            // 3. Fetch Divisions if Circle is defined
            if (rule.circleName) {
                newOptions.divisions = await fetchAllDivisions(rule.circleName) || [];
            }
            // 4. Fetch Areas if Division is defined
            if (rule.divisionName) {
                newOptions.areas = await fetchAreaNames(rule.divisionName) || [];
            }
            setOptions(newOptions);
        } catch (error) {
            console.error("Error pre-fetching location options:", error);
        }
    };
    // ----------------------------------------------------------------------------------

    // --- Handlers for Hierarchy (Modified to find Names for API calls) ---
    
    // Find Name helper
    const getName = (id, optionsList) => optionsList.find(o => o.id === id)?.name;

    const handleStateChange = async (e) => {
        const newStateId = e.target.value;
        const newStateName = getName(newStateId, stateOptions);
        
        // Reset all children
        setLocationIds({ stateId: newStateId, zoneId: null, circleId: null, divisionId: null, areaIds: [] });
        setOptions({ zones: [], circles: [], divisions: [], areas: [] });

        if (newStateId && newStateId !== 'ALL' && newStateName) {
            try {
                const data = await fetchAllZones(newStateName); 
                setOptions(prev => ({ ...prev, zones: data || [] }));
            } catch (err) { console.error(err); }
        }
    };

    const handleZoneChange = async (e) => {
        const newZoneId = e.target.value;
        const newZoneName = getName(newZoneId, options.zones);
        setLocationIds(prev => ({ ...prev, zoneId: newZoneId, circleId: null, divisionId: null, areaIds: [] }));
        
        setOptions(prev => ({ ...prev, circles: [], divisions: [], areas: [] })); // Reset children options

        if (newZoneId && newZoneId !== 'ALL' && newZoneName) {
            try {
                const data = await fetchAllCircles(newZoneName);
                setOptions(prev => ({ ...prev, circles: data || [] }));
            } catch (err) { console.error(err); }
        }
    };

    const handleCircleChange = async (e) => {
        const newCircleId = e.target.value;
        const newCircleName = getName(newCircleId, options.circles);
        setLocationIds(prev => ({ ...prev, circleId: newCircleId, divisionId: null, areaIds: [] }));

        setOptions(prev => ({ ...prev, divisions: [], areas: [] })); // Reset children options
        
        if (newCircleId && newCircleId !== 'ALL' && newCircleName) {
            try {
                const data = await fetchAllDivisions(newCircleName);
                setOptions(prev => ({ ...prev, divisions: data || [] }));
            } catch (err) { console.error(err); }
        }
    };

    const handleDivisionChange = async (e) => {
        const newDivId = e.target.value;
        const newDivName = getName(newDivId, options.divisions);
        setLocationIds(prev => ({ ...prev, divisionId: newDivId, areaIds: [] }));

        setOptions(prev => ({ ...prev, areas: [] })); // Reset area options

        if (newDivId && newDivId !== 'ALL' && newDivName) {
            try {
                const data = await fetchAreaNames(newDivName);
                setOptions(prev => ({ ...prev, areas: data || [] }));
            } catch (err) { console.error(err); }
        }
    };

    // --- Access Rules List Management ---

    const handleAddUpdateRule = () => {
        const { stateId, zoneId, circleId, divisionId, areaIds } = locationIds;
        
        if (!stateId) {
             alert("Please select a State or 'All States' to create a rule.");
             return;
        }

        // Get Names for the DTO
        const stateName = getName(stateId, stateOptions);
        const zoneName = getName(zoneId, options.zones);
        const circleName = getName(circleId, options.circles);
        const divisionName = getName(divisionId, options.divisions);

        // Function to create a base rule object
        const createBaseRule = (area = null) => ({
            stateId: stateId === 'ALL' ? null : stateId,
            stateName: stateId === 'ALL' ? 'ALL' : stateName,
            zoneId: zoneId === 'ALL' ? null : zoneId,
            zoneName: zoneId === 'ALL' ? 'ALL' : zoneName,
            circleId: circleId === 'ALL' ? null : circleId,
            circleName: circleId === 'ALL' ? 'ALL' : circleName,
            divisionId: divisionId === 'ALL' ? null : divisionId,
            divisionName: divisionId === 'ALL' ? 'ALL' : divisionName,
            areaId: area ? area.id : null,
            areaName: area ? area.name : 'ALL',
        });

        let newRules = [];
        
        if (!areaIds || areaIds.length === 0 || areaIds.some(a => a.id === 'ALL')) {
            // Rule for ALL Areas, or up to Division/Circle/Zone/State level
            newRules.push(createBaseRule(null));
        } else {
            // Rules for specific Areas
            areaIds.forEach(area => {
                newRules.push(createBaseRule(area));
            });
        }
        
        // Update the list state
        let updatedList = [...accessRulesList];
        if (selectedRuleIndex !== null && selectedRuleIndex >= 0) {
            // Replace the existing rule(s) at the selected index with the new one(s)
            // NOTE: This complex logic assumes the user replaces a single-area rule with a multi-area rule, 
            // which requires careful indexing. For simplicity, we'll replace just the rule being edited.
            updatedList[selectedRuleIndex] = newRules[0]; // Simplification: assume editing one rule at a time
        } else {
            // Add new rules
            updatedList = [...updatedList, ...newRules];
        }

        setAccessRulesList(updatedList);
        // Clear the current hierarchy fields for the next input
        setLocationIds({ stateId: null, zoneId: null, circleId: null, divisionId: null, areaIds: [] });
        setOptions({ zones: [], circles: [], divisions: [], areas: [] });
        setSelectedRuleIndex(null); // Deselect current rule
    };

    const handleRemoveRule = (index) => {
        const updatedList = accessRulesList.filter((_, i) => i !== index);
        setAccessRulesList(updatedList);
        setSelectedRuleIndex(null);
    };

    const handleEditRuleSelect = (rule, index) => {
        setSelectedRuleIndex(index);
        
        // 1. Set the IDs for the dropdowns
        setLocationIds({
            stateId: rule.stateId || 'ALL',
            zoneId: rule.zoneId || 'ALL',
            circleId: rule.circleId || 'ALL',
            divisionId: rule.divisionId || 'ALL',
            // Load Area(s)
            areaIds: rule.areaId ? [ { id: rule.areaId, name: rule.areaName } ] : [],
        });
        
        // 2. Pre-fetch options for the cascading dropdowns
        loadOptionsForRule(rule);
    };

    // --- Final Submit Logic ---
    const onFormSubmit = (e) => {
        e.preventDefault();
        
        // CRITICAL: Strip the "Name" fields from the rules before submission
        const accessListForSubmission = accessRulesList.map(rule => ({
            stateId: rule.stateId === 'ALL' ? null : rule.stateId,
            zoneId: rule.zoneId === 'ALL' ? null : rule.zoneId,
            circleId: rule.circleId === 'ALL' ? null : rule.circleId,
            divisionId: rule.divisionId === 'ALL' ? null : rule.divisionId,
            areaId: rule.areaId, // If areaId is null, it means 'ALL' areas for that division
        }));

        const userCreationDTO = {
            username: formData.username,
            password: formData.password, 
            mobile: formData.mobile, // Use formData.mobile, not .phone
            email: formData.email,
            role: formData.role,
            accessList: accessListForSubmission,
            pageAccessLevel: formData.pageAccessLevel, 
            serverTime: new Date()
        };

        handleSubmit(userCreationDTO);
    };
    const allAreasOption = { id: 'ALL', name: 'All Areas' };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        component="form"
        onSubmit={onFormSubmit}
        sx={{
          width: "700px", 
          maxHeight: "90vh",
          overflowY: "auto",
          backgroundColor: colors.primary[100],
          color: "#fff",
          m: "auto", p: "30px", borderRadius: "12px",
          top: "50%", left: "50%", transform: "translate(-50%, -50%)", position: "absolute",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, textAlign: "center", color: colors.primary[200] }}>
          {viewMode ? "View User" : isEditing ? "Edit User" : "Add User"}
        </Typography>

        {userError && <Typography color="error" sx={{ textAlign: "center", mb: 2 }}>{userError}</Typography>}

        {/* --- BASIC INFO SECTION --- */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <TextField
              required fullWidth label="Username" variant="outlined"
              value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              sx={textFieldStyles} disabled={viewMode}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required fullWidth label="Email" type="email" variant="outlined"
              value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              sx={textFieldStyles} disabled={viewMode}
            />
          </Grid>
          <Grid item xs={6}>
            {!isEditing && !viewMode && (
              <TextField
                required fullWidth label="Password" type="password" variant="outlined"
                value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                sx={textFieldStyles}
              />
            )}
          </Grid>
          <Grid item xs={6}>
            <TextField
              required fullWidth label="mobile" variant="outlined"
              value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, "") })}
              inputProps={{ maxLength: 10 }} sx={textFieldStyles} disabled={viewMode}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              select required fullWidth label="Role" variant="outlined"
              value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              sx={textFieldStyles} disabled={isEditing || viewMode}
            >
              {roles.map((role) => <MenuItem key={role} value={role}>{role}</MenuItem>)}
            </TextField>
          </Grid>
        </Grid>

        <Typography variant="h6" sx={{ color: colors.primary[200], mb: 1, mt: 2 }}>Location Access</Typography>
        
        {/* --- LOCATION HIERARCHY --- */}
        <Grid container spacing={2}>
                    {/* STATE */}
                    <Grid item xs={6} md={4}>
                        <TextField
                            select fullWidth label="State" variant="outlined" sx={textFieldStyles}
                            value={locationIds.stateId || ''} onChange={handleStateChange} disabled={viewMode}
                        >
                            <MenuItem value="ALL">All States</MenuItem>
                            {stateOptions.map((s) => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
                        </TextField>
                    </Grid>
                    {/* ZONE */}
                    <Grid item xs={6} md={4}>
                        <TextField
                            select fullWidth label="Zone" variant="outlined" sx={textFieldStyles}
                            value={locationIds.zoneId || ''} onChange={handleZoneChange}
                            disabled={viewMode || !locationIds.stateId || locationIds.stateId === 'ALL'}
                        >
                            <MenuItem value="ALL">All Zones</MenuItem>
                            {options.zones.map((z) => <MenuItem key={z.id} value={z.id}>{z.name}</MenuItem>)}
                        </TextField>
                    </Grid>
                    {/* CIRCLE */}
                    <Grid item xs={6} md={4}>
                        <TextField
                            select fullWidth label="Circle" variant="outlined" sx={textFieldStyles}
                            value={locationIds.circleId || ''} onChange={handleCircleChange}
                            disabled={viewMode || !locationIds.zoneId || locationIds.zoneId === 'ALL'}
                        >
                            <MenuItem value="ALL">All Circles</MenuItem>
                            {options.circles.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
                        </TextField>
                    </Grid>
                    {/* DIVISION */}
                    <Grid item xs={6} md={6}>
                        <TextField
                            select fullWidth label="Division" variant="outlined" sx={textFieldStyles}
                            value={locationIds.divisionId || ''} onChange={handleDivisionChange}
                            disabled={viewMode || !locationIds.circleId || locationIds.circleId === 'ALL'}
                        >
                            <MenuItem value="ALL">All Divisions</MenuItem>
                            {options.divisions.map((d) => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
                        </TextField>
                    </Grid>
                    {/* AREAS (Multi Select) */}
                    <Grid item xs={12} md={6}>
                        <Autocomplete
                            multiple
                            options={[allAreasOption, ...options.areas]}
                            getOptionLabel={(option) => option.name}
                            value={locationIds.areaIds}
                            disabled={viewMode || !locationIds.divisionId || locationIds.divisionId === 'ALL'}
                            onChange={(event, newValue) => {
                                                        // Check if "All Areas" is currently present in the new selection
                              const isAllSelected = newValue.some(opt => opt.id === 'ALL');
                              
                              // Check if "All Areas" was ALREADY selected before this change
                              const wasAllSelected = locationIds.areaIds.some(opt => opt.id === 'ALL');

                              if (isAllSelected && !wasAllSelected) {
                                // SCENARIO 1: User just clicked "All Areas". 
                                // Clear specific selections and keep only "All Areas".
                                setLocationIds({ ...locationIds, areaIds: [allAreasOption] });
                              } 
                              else if (isAllSelected && wasAllSelected && newValue.length > 1) {
                                // SCENARIO 2: "All Areas" was already there, and user clicked a specific area.
                                // Remove "All Areas" and keep the specific ones.
                                const specificOptions = newValue.filter(opt => opt.id !== 'ALL');
                                setLocationIds({ ...locationIds, areaIds: specificOptions });
                              } 
                              else {
                                // SCENARIO 3: Standard selection/deselection
                                setLocationIds({ ...locationIds, areaIds: newValue });
                              }
                            }}

                            // 3. Ensure React knows how to compare the "All" object with API objects
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip variant="outlined" label={option.name} {...getTagProps({ index })} 
                                     sx={{ color: '#fff', borderColor: colors.primary[200] }} />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField {...params} variant="outlined" label="Areas" sx={textFieldStyles} placeholder="Select Areas" />
                            )}
                        />
                    </Grid>
                </Grid>

                {/* ADD/UPDATE RULE BUTTON */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    {!viewMode && (
                        <Button 
                            variant="contained" 
                            onClick={handleAddUpdateRule}
                            disabled={!locationIds.stateId}
                            sx={{
                                background: selectedRuleIndex !== null 
                                    ? 'linear-gradient(to right, #ffa726, #fb8c00)' // Orange for Update
                                    : 'linear-gradient(to right, #4CAF50, #81c784)', // Green for Add
                                color: 'white'
                            }}
                        >
                            {selectedRuleIndex !== null ? "Update Rule" : "Add Rule"}
                        </Button>
                    )}
                </Box>
                
                {/* --- DISPLAY CURRENT ACCESS RULES LIST --- */}
                <Typography variant="subtitle1" sx={{ color: colors.primary[200], mb: 1, mt: 3 }}>
                    Current Access Rules ({accessRulesList.length})
                </Typography>
                <Box sx={{ border: `1px solid ${colors.primary[300]}`, p: 1, maxHeight: '150px', overflowY: 'auto' }}>
                    {accessRulesList.length === 0 ? (
                        <Typography sx={{ color: colors.grey[500] }}>No access rules defined.</Typography>
                    ) : (
                        accessRulesList.map((rule, index) => (
                            <Box 
                                key={index} 
                                sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    p: 1, 
                                    mb: 0.5,
                                    borderRadius: '4px',
                                    backgroundColor: index === selectedRuleIndex ? colors.primary[300] : colors.primary[800],
                                    color: 'black',
                                }}
                            >
                                <Typography variant="body2" sx={{ flexGrow: 1 }}>
                                    {`State: ${rule.stateName || 'ALL'} > Zone: ${rule.zoneName || 'ALL'} > Circle: ${rule.circleName || 'ALL'} > Division: ${rule.divisionName || 'ALL'} > Area: ${rule.areaName || 'ALL'}`}
                                </Typography>
                                {!viewMode && (
                                    <Box sx={{ display: 'flex' }}>
                                        <Button 
                                            size="small" 
                                            onClick={() => handleEditRuleSelect(rule, index)} 
                                            sx={{ minWidth: 'auto', p: '2px 8px', color: '#ffb300' }}
                                        >
                                            Edit
                                        </Button>
                                        <Button 
                                            size="small" 
                                            onClick={() => handleRemoveRule(index)} 
                                            sx={{ minWidth: 'auto', p: '2px 8px', color: '#f44336' }}
                                        >
                                            Remove
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        ))
                    )}
                </Box>

                <Box sx={{ mt: 3, mb: 3 }}>
            <Typography variant="subtitle1" sx={{ color: colors.primary[200], mb: 1 }}>
                Page Access Permissions
            </Typography>
            
            {formData.role === "SUPERADMIN" ? (
                <Typography sx={{ 
                    color: colors.greenAccent?.[400] || '#4cceac', 
                    fontStyle: 'italic',
                    textAlign: 'center' 
                }}>
                    SUPERADMIN has access to all pages by default.
                </Typography>
            ) : (
                // Use the structure you provided, adjusting colors for consistency
                <Box sx={{ mb: 4 }}>
                    <FormGroup sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 1 }}>
                        {PAGES.map(page => (
                            <FormControlLabel
                                key={page.key}
                                control={
                                    <Checkbox
                                        checked={!!formData.pageAccessLevel?.[page.key]}
                                        onChange={e =>
                                            setFormData({
                                                ...formData,
                                                pageAccessLevel: { ...formData.pageAccessLevel, [page.key]: e.target.checked },
                                            })
                                        }
                                        disabled={viewMode}
                                        sx={{ 
                                            color: colors.primary[200], 
                                            '&.Mui-checked': { color: colors.greenAccent?.[400] || '#4cceac' } 
                                        }}
                                    />
                                }
                                label={<Typography sx={{ color: colors.primary[200] }}>{page.label}</Typography>}
                            />
                        ))}
                    </FormGroup>
                </Box>
            )}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button onClick={handleClose} variant="outlined" sx={{ color: colors.primary[200], borderColor: colors.primary[200] }}>
            {viewMode ? "Close" : "Cancel"}
          </Button>
          {!viewMode && (
            <Button type="submit" variant="contained" sx={buttonGradient}>
              {isEditing ? "Save Changes" : "Add User"}
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
};
export default UserForm;