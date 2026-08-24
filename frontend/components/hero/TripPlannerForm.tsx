import React from 'react';
import { Form, TextField, Input, NumberField, Select, Label, ListBox, Button, TextArea } from "@heroui/react";
import { TRAVEL_STYLES, CURRENCIES, POPULAR_DESTINATIONS } from "@/constants/travel";

interface TripPlannerFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

const TripPlannerForm: React.FC<TripPlannerFormProps> = ({ onSubmit, isLoading }) => {
  const setDestination = (destination: string) => {
    const input = document.querySelector('input[name="destination"]') as HTMLInputElement;
    if (input) input.value = destination;
  };

  return (
    <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
      <Form
        className="mx-auto max-w-3xl rounded-3xl bg-surface backdrop-blur-xl border border-border shadow-2xl p-6 sm:p-8"
        onSubmit={onSubmit}
      >
        <div className="space-y-5">
          {/* Destination Input */}
          <TextField className="w-full" isRequired name="destination" type="text">
            <Input
              placeholder="Where do you want to go? (e.g., Tokyo, Paris, Bali...)"
              variant="secondary"
              className="text-lg h-14"
            />
          </TextField>

          {/* Quick Action Chips */}
          <div className="flex flex-wrap gap-2 justify-center">
            {POPULAR_DESTINATIONS.map((dest) => (
              <button
                key={dest.name}
                type="button"
                className="px-4 py-2 rounded-full bg-surface-secondary hover:bg-surface-tertiary border border-border text-foreground text-sm transition-all"
                onClick={() => setDestination(dest.name)}
              >
                {dest.emoji} {dest.name.split(',')[0]}
              </button>
            ))}
          </div>

          {/* Compact Grid for Other Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            {/* Budget */}
            <NumberField
              isRequired
              defaultValue={2000}
              formatOptions={{
                style: "decimal",
                maximumFractionDigits: 0,
              }}
              minValue={0}
              name="budget"
              variant="secondary"
            >
              <Label className="text-xs font-medium text-foreground mb-1.5">Budget</Label>
              <NumberField.Group>
                <NumberField.DecrementButton />
                <NumberField.Input className="text-center" />
                <NumberField.IncrementButton />
              </NumberField.Group>
            </NumberField>

            {/* Currency */}
            <Select
              isRequired
              defaultValue="USD"
              name="currency"
              placeholder="Currency"
              variant="secondary"
            >
              <Label className="text-xs font-medium text-foreground mb-1.5">Currency</Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {CURRENCIES.map((currency) => (
                    <ListBox.Item key={currency.id} id={currency.id} textValue={currency.name}>
                      {currency.symbol} {currency.name}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>

            {/* Days */}
            <NumberField
              isRequired
              defaultValue={5}
              minValue={1}
              maxValue={365}
              name="days"
              variant="secondary"
            >
              <Label className="text-xs font-medium text-foreground mb-1.5">Days</Label>
              <NumberField.Group>
                <NumberField.DecrementButton />
                <NumberField.Input className="text-center" />
                <NumberField.IncrementButton />
              </NumberField.Group>
            </NumberField>

            {/* Travel Style */}
            <Select
              isRequired
              defaultValue="family"
              name="travelStyle"
              placeholder="Style"
              variant="secondary"
            >
              <Label className="text-xs font-medium text-foreground mb-1.5">Style</Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {TRAVEL_STYLES.map((style) => (
                    <ListBox.Item key={style.id} id={style.id} textValue={style.name}>
                      {style.name}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
          </div>

          <TextArea
            name="additionalContext"
            fullWidth
            aria-label="Additional context"
            placeholder="Share a additional context..."
            variant="secondary"
            rows={6}
          />

          {/* Submit Button */}
          <Button
            className="w-full h-14 text-lg font-semibold"
            isPending={isLoading}
            size="lg"
            type="submit"
          >
            <svg className="size-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Generate My Itinerary
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default TripPlannerForm;
