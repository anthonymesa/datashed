import { useState } from "react";
import { Combobox, Input, InputBase, useCombobox } from "@mantine/core";

export function GroupedSelect({
  leftSection,
  disabled,
  data,
  value,
  onChange,
  placeholder,
  label,
}) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        onChange(val);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          component="button"
          label={label}
          type="button"
          pointer
          leftSection={leftSection}
          rightSection={<Combobox.Chevron />}
          onClick={() => combobox.toggleDropdown()}
          rightSectionPointerEvents="none"
          disabled={disabled}
        >
          {value || <Input.Placeholder>{placeholder}</Input.Placeholder>}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          <Combobox.Group label="Datastreams">
            {data
              .filter((each) => each.type == "datastreams")
              .map((each) => (
                <Combobox.Option
                  key={`GroupSelectEditActionModal${each.id}`}
                  value={each.value}
                >
                  {each.label}
                </Combobox.Option>
              ))}
          </Combobox.Group>

          <Combobox.Group label="Actions">
            {data
              .filter((each) => each.type == "actions")
              .map((each) => (
                <Combobox.Option
                  key={`GroupSelectEditActionModal${each.id}`}
                  value={each.value}
                >
                  {each.label}
                </Combobox.Option>
              ))}
          </Combobox.Group>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}

export default GroupedSelect;
