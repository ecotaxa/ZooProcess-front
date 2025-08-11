import { render, screen } from '@testing-library/react';
import { BackgroundTimeline } from './backgroundTimeline';
import { eState } from './eStateBackground';

describe('BackgroundTimeline', () => {
  test('process state renders Process component with correct props', () => {
    const mockProject = {
      id: '123',
      name: 'Test Project',
    };
    const mockInstrument = {
      id: '456',
      name: 'Test Instrument',
    };

    const mockScanData = {
      background1: 'path/to/bg1',
      background2: 'path/to/bg2',
    };

    render(
      <BackgroundTimeline
        project={mockProject}
        instrument={mockInstrument}
        initialState={eState.process}
        initialScanData={mockScanData}
      />
    );

    expect(screen.getByTestId('ScanCard')).toBeInTheDocument();

    expect(screen.getByText(/Test Project/)).toBeInTheDocument();
    expect(screen.getByText(/path\/to\/bg1/)).toBeInTheDocument();
    expect(screen.getByText(/path\/to\/bg2/)).toBeInTheDocument();
  });
});
