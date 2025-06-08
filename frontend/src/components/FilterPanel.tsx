import { Chip, Group, Text, RangeSlider } from '@mantine/core';
import { useLabStore } from '../store/labStore';

const POSITIONS = ['UTG', 'MP', 'CO', 'BTN', 'SB', 'BB'];

const FilterPanel = () => {
  const { filters, setFilters } = useLabStore();

  return (
    <div>
      <Text size="lg" fw={500}>Позиция</Text>
      <Chip.Group multiple={false} value={filters.position} onChange={(val) => setFilters({ position: val })}>
        <Group mt="sm">
          {POSITIONS.map(pos => <Chip key={pos} value={pos}>{pos}</Chip>)}
        </Group>
      </Chip.Group>
      
      <Text size="lg" fw={500} mt="lg">Глубина стека (ББ)</Text>
      <RangeSlider
        mt="xl"
        mb="xl"
        min={0}
        max={100}
        step={5}
        value={[filters.stackFrom, filters.stackTo]}
        onChangeEnd={([from, to]) => setFilters({ stackFrom: from, stackTo: to })}
        marks={[{ value: 20, label: '20bb' }, { value: 50, label: '50bb' }, { value: 80, label: '80bb' }]}
      />
    </div>
  );
};
export default FilterPanel;