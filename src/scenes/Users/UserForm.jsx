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
  Grid,
  Popover,
  InputAdornment,
  IconButton,
  ClickAwayListener,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
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
  stateOptions,
  viewMode,
  formData,
  setFormData,
  // Password validation props
  passwordStrength,
  handlePasswordChange,
  handlePasswordFocus,
  handlePasswordBlur,
  passwordAnchorEl,
  showPasswordPopover,
  PasswordPopoverContent,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [locationIds, setLocationIds] = useState({
    stateId: null,
    zoneId: null,
    circleId: null,
    divisionId: null,
    areaIds: []
  });

  const [options, setOptions] = useState({
    zones: [],
    circles: [],
    divisions: [],
    areas: []
  });

  const [accessRulesList, setAccessRulesList] = useState([]);
  const [selectedRuleIndex, setSelectedRuleIndex] = useState(null);
  const [localShowPopover, setLocalShowPopover] = useState(false);

  useEffect(() => {
    if (open) {
      const rules = formData.accessRules || [];
      setAccessRulesList(rules);
      
      if (rules.length > 0) {
        const firstRule = rules[0];
        setSelectedRuleIndex(0);
        
        setLocationIds({
          stateId: firstRule.stateId || 'ALL',
          zoneId: firstRule.zoneId || 'ALL',
          circleId: firstRule.circleId || 'ALL',
          divisionId: firstRule.divisionId || 'ALL',
          areaIds: firstRule.areaId ? [{ id: firstRule.areaId, name: firstRule.areaName }] : [],
        });
        
        loadOptionsForRule(firstRule);
      } else {
        setSelectedRuleIndex(null);
        setLocationIds({ stateId: null, zoneId: null, circleId: null, divisionId: null, areaIds: [] });
        setOptions({ zones: [], circles: [], divisions: [], areas: [] });
      }
    }
    // Reset popover state when modal closes
    if (!open) {
      setLocalShowPopover(false);
    }
  }, [open, formData.accessRules]);

  const loadOptionsForRule = async (rule) => {
    try {
      const newOptions = { zones: [], circles: [], divisions: [], areas: [] };
      
      if (rule.stateName) {
        newOptions.zones = await fetchAllZones(rule.stateName) || [];
      }
      if (rule.zoneName) {
        newOptions.circles = await fetchAllCircles(rule.zoneName) || [];
      }
      if (rule.circleName) {
        newOptions.divisions = await fetchAllDivisions(rule.circleName) || [];
      }
      if (rule.divisionName) {
        newOptions.areas = await fetchAreaNames(rule.divisionName) || [];
      }
      setOptions(newOptions);
    } catch (error) {
      console.error("Error pre-fetching location options:", error);
    }
  };

  const getName = (id, optionsList) => optionsList.find(o => o.id === id)?.name;

  const handleStateChange = async (e) => {
    const newStateId = e.target.value;
    const newStateName = getName(newStateId, stateOptions);
    
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
    setOptions(prev => ({ ...prev, circles: [], divisions: [], areas: [] }));

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
    setOptions(prev => ({ ...prev, divisions: [], areas: [] }));

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
    setOptions(prev => ({ ...prev, areas: [] }));

    if (newDivId && newDivId !== 'ALL' && newDivName) {
      try {
        const data = await fetchAreaNames(newDivName);
        setOptions(prev => ({ ...prev, areas: data || [] }));
      } catch (err) { console.error(err); }
    }
  };

  const handleAddUpdateRule = () => {
    const { stateId, zoneId, circleId, divisionId, areaIds } = locationIds;
    
    if (!stateId) {
      alert("Please select a State or 'All States' to create a rule.");
      return;
    }

    const stateName = getName(stateId, stateOptions);
    const zoneName = getName(zoneId, options.zones);
    const circleName = getName(circleId, options.circles);
    const divisionName = getName(divisionId, options.divisions);

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
      newRules.push(createBaseRule(null));
    } else {
      areaIds.forEach(area => {
        newRules.push(createBaseRule(area));
      });
    }
    
    let updatedList = [...accessRulesList];
    if (selectedRuleIndex !== null && selectedRuleIndex >= 0) {
      updatedList[selectedRuleIndex] = newRules[0];
    } else {
      updatedList = [...updatedList, ...newRules];
    }

    setAccessRulesList(updatedList);
    setLocationIds({ stateId: null, zoneId: null, circleId: null, divisionId: null, areaIds: [] });
    setOptions({ zones: [], circles: [], divisions: [], areas: [] });
    setSelectedRuleIndex(null);
  };

  const handleRemoveRule = (index) => {
    const updatedList = accessRulesList.filter((_, i) => i !== index);
    setAccessRulesList(updatedList);
    setSelectedRuleIndex(null);
  };

  const handleEditRuleSelect = (rule, index) => {
    setSelectedRuleIndex(index);
    setLocationIds({
      stateId: rule.stateId || 'ALL',
      zoneId: rule.zoneId || 'ALL',
      circleId: rule.circleId || 'ALL',
      divisionId: rule.divisionId || 'ALL',
      areaIds: rule.areaId ? [{ id: rule.areaId, name: rule.areaName }] : [],
    });
    loadOptionsForRule(rule);
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    
    const accessListForSubmission = accessRulesList.map(rule => ({
      stateId: rule.stateId === 'ALL' ? null : rule.stateId,
      zoneId: rule.zoneId === 'ALL' ? null : rule.zoneId,
      circleId: rule.circleId === 'ALL' ? null : rule.circleId,
      divisionId: rule.divisionId === 'ALL' ? null : rule.divisionId,
      areaId: rule.areaId,
    }));

    const userCreationDTO = {
      username: formData.username,
      password: formData.password,
      mobile: formData.mobile,
      email: formData.email,
      role: formData.role,
      accessList: accessListForSubmission,
      pageAccessLevel: formData.pageAccessLevel,
      serverTime: new Date()
    };

    handleSubmit(userCreationDTO);
  };

  const allAreasOption = { id: 'ALL', name: 'All Areas' };

  // Local handlers for password popover
  const handleLocalPasswordFocus = (event) => {
    if (handlePasswordFocus) {
      handlePasswordFocus(event);
    }
    // Set local popover state to true when focusing
    if (formData.password.length > 0) {
      setLocalShowPopover(true);
    }
  };

  const handleLocalPasswordBlur = (event) => {
    // Don't immediately hide popover, let ClickAwayListener handle it
    setTimeout(() => {
      setLocalShowPopover(false);
      if (handlePasswordBlur) {
        handlePasswordBlur();
      }
    }, 200);
  };

  const handleLocalPasswordChange = (e) => {
    if (handlePasswordChange) {
      handlePasswordChange(e);
    }
    // Show popover when typing
    if (e.target.value.length > 0) {
      setLocalShowPopover(true);
    } else {
      setLocalShowPopover(false);
    }
  };

  const handlePopoverClose = () => {
    setLocalShowPopover(false);
  };

  const isPopoverOpen = showPasswordPopover || localShowPopover;

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
          m: "auto",
          p: "30px",
          borderRadius: "12px",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          position: "absolute",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, textAlign: "center", color: colors.primary[200] }}>
          {viewMode ? "View User" : isEditing ? "Edit User" : "Add User"}
        </Typography>

        {userError && <Typography color="error" sx={{ textAlign: "center", mb: 2 }}>{userError}</Typography>}

        {/* BASIC INFO SECTION */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <TextField
              required
              fullWidth
              label="Username"
              variant="outlined"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              sx={textFieldStyles}
              disabled={viewMode}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              sx={textFieldStyles}
              disabled={viewMode}
            />
          </Grid>
          <Grid item xs={6}>
            {(!isEditing || formData.password) && !viewMode && (
              <TextField
                required={!isEditing}
                fullWidth
                label="Password"
                // type={showPassword ? "text" : "password"}
                variant="outlined"
                value={formData.password}
                onChange={handleLocalPasswordChange}
                onFocus={handleLocalPasswordFocus}
                onBlur={handleLocalPasswordBlur}
                sx={textFieldStyles}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                    </InputAdornment>
                  ),
                }}
              />
            )}
            {isEditing && !formData.password && !viewMode && (
              <TextField
                fullWidth
                label="New Password (Optional)"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                value={formData.password}
                onChange={handleLocalPasswordChange}
                onFocus={handleLocalPasswordFocus}
                onBlur={handleLocalPasswordBlur}
                sx={textFieldStyles}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: colors.primary[200] }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              fullWidth
              label="Mobile"
              variant="outlined"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, "") })}
              inputProps={{ maxLength: 10 }}
              sx={textFieldStyles}
              disabled={viewMode}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              required
              fullWidth
              label="Role"
              variant="outlined"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              sx={textFieldStyles}
              disabled={isEditing || viewMode}
            >
              {roles.map((role) => (
                <MenuItem key={role} value={role}>{role}</MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        {/* PASSWORD POPOVER - Using ClickAwayListener for better interaction */}
        {PasswordPopoverContent && isPopoverOpen && !viewMode && formData.password.length > 0 && (
          <ClickAwayListener onClickAway={handlePopoverClose}>
            <Popover
              open={isPopoverOpen}
              anchorEl={passwordAnchorEl}
              onClose={handlePopoverClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              PaperProps={{
                sx: {
                  mt: 1,
                  backgroundColor: colors.primary[100],
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  border: `1px solid ${colors.primary[300]}`,
                  maxWidth: '300px',
                  zIndex: 9999,
                  pointerEvents: 'auto',
                }
              }}
              disableAutoFocus
              disableEnforceFocus
              disableRestoreFocus
            >
              {PasswordPopoverContent()}
            </Popover>
          </ClickAwayListener>
        )}

        <Typography variant="h6" sx={{ color: colors.primary[200], mb: 1, mt: 2 }}>Location Access</Typography>
        
        {/* LOCATION HIERARCHY */}
        <Grid container spacing={2}>
          <Grid item xs={6} md={4}>
            <TextField
              select
              fullWidth
              label="State"
              variant="outlined"
              sx={textFieldStyles}
              value={locationIds.stateId || ''}
              onChange={handleStateChange}
              disabled={viewMode}
            >
              <MenuItem value="ALL">All States</MenuItem>
              {stateOptions.map((s) => (
                <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} md={4}>
            <TextField
              select
              fullWidth
              label="Zone"
              variant="outlined"
              sx={textFieldStyles}
              value={locationIds.zoneId || ''}
              onChange={handleZoneChange}
              disabled={viewMode || !locationIds.stateId || locationIds.stateId === 'ALL'}
            >
              <MenuItem value="ALL">All Zones</MenuItem>
              {options.zones.map((z) => (
                <MenuItem key={z.id} value={z.id}>{z.name}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} md={4}>
            <TextField
              select
              fullWidth
              label="Circle"
              variant="outlined"
              sx={textFieldStyles}
              value={locationIds.circleId || ''}
              onChange={handleCircleChange}
              disabled={viewMode || !locationIds.zoneId || locationIds.zoneId === 'ALL'}
            >
              <MenuItem value="ALL">All Circles</MenuItem>
              {options.circles.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} md={6}>
            <TextField
              select
              fullWidth
              label="Division"
              variant="outlined"
              sx={textFieldStyles}
              value={locationIds.divisionId || ''}
              onChange={handleDivisionChange}
              disabled={viewMode || !locationIds.circleId || locationIds.circleId === 'ALL'}
            >
              <MenuItem value="ALL">All Divisions</MenuItem>
              {options.divisions.map((d) => (
                <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <Autocomplete
              multiple
              options={[allAreasOption, ...options.areas]}
              getOptionLabel={(option) => option.name}
              value={locationIds.areaIds}
              disabled={viewMode || !locationIds.divisionId || locationIds.divisionId === 'ALL'}
              onChange={(event, newValue) => {
                const isAllSelected = newValue.some(opt => opt.id === 'ALL');
                const wasAllSelected = locationIds.areaIds.some(opt => opt.id === 'ALL');

                if (isAllSelected && !wasAllSelected) {
                  setLocationIds({ ...locationIds, areaIds: [allAreasOption] });
                } else if (isAllSelected && wasAllSelected && newValue.length > 1) {
                  const specificOptions = newValue.filter(opt => opt.id !== 'ALL');
                  setLocationIds({ ...locationIds, areaIds: specificOptions });
                } else {
                  setLocationIds({ ...locationIds, areaIds: newValue });
                }
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option.name}
                    {...getTagProps({ index })}
                    sx={{ color: '#fff', borderColor: colors.primary[200] }}
                  />
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
                  ? 'linear-gradient(to right, #ffa726, #fb8c00)'
                  : 'linear-gradient(to right, #4CAF50, #81c784)',
                color: 'white'
              }}
            >
              {selectedRuleIndex !== null ? "Update Rule" : "Add Rule"}
            </Button>
          )}
        </Box>
        
        {/* DISPLAY CURRENT ACCESS RULES LIST */}
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
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{ color: colors.primary[200], borderColor: colors.primary[200] }}
          >
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