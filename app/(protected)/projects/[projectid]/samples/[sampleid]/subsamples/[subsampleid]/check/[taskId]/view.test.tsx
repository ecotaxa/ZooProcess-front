import { render } from '@testing-library/react';
import ViewPage from '../view';
import { Sample, SubSample } from '@/app/api/network/interfaces';


// Renders view page with valid sample and subsample data containing scan images
    it('should render view page with scan images when valid sample and subsample data provided', () => {
        const mockSample: Sample = {
            id: 'sample-123',
            name: 'sample-name',

            metadata: [{ name: 'sample', value:"value", type:"string"}],
            projectId: "4",
            subsample: [],
            project: {
                id:"4",
                name:"projectname",
                acronym:"acronym",
                description:"description",
                driveId:"5",
                qc:"qc",
                instrument:{id:"6",name:"Zooscan",model:"1", sn:"1"},
                scanningOptions:"scanningoptions",
              drive:{ id:"5", name:"drive", url:"/drive"},
              updatedAt: new Date("1970-01-01"),
              createdAt: new Date("1970-01-01"),
            }
        };
    
        const mockSubsample: SubSample = {
            id : "1",
            name: 'subsamplename',
            metadata: [{ name: 'subsample', value:"value", type:"string"}],
            scan: [
                { id:"2", type: 'RAW', url: '/path/to/raw-image.jpg', archived:false, deleted:false , metadata: [{ name: 'raw', value:"value", type:"string"}],
                { id:"3", type: 'MEDIUM_BACKGROUND', url: '/path/to/background-image.jpg', archived:false, deleted:false , metadata: [{ name: 'med back', value:"value", type:"string"}],
            ]
        };
    
        const { getByText, getByRole } = render(
            <ViewPage sample={mockSample} subsample={mockSubsample} />
        );
    
        expect(getByText('View Page')).toBeInTheDocument();
        expect(getByText('2 images associated')).toBeInTheDocument();
        expect(getByText('RAW | /path/to/raw-image.jpg')).toBeInTheDocument();
        expect(getByText('MEDIUM_BACKGROUND | /path/to/background-image.jpg')).toBeInTheDocument();
        expect(getByText('raw-image.jpg')).toBeInTheDocument();
        expect(getByText('background-image.jpg')).toBeInTheDocument();
    });

        // Handles subsample with null or undefined scan property
    it('should display no scan data message when subsample has null or undefined scan property', () => {
        const mockSample = {
            id: 'sample-123',
            project: 'test-project'
        };
    
        const mockSubsample = {
            scan: null
        };
    
        const { getByText, queryByText } = render(
            <ViewPage sample={mockSample} subsample={mockSubsample} />
        );
    
        expect(getByText('View Page')).toBeInTheDocument();
        expect(getByText('No scan data available for this subsample.')).toBeInTheDocument();
        expect(queryByText('images associated')).not.toBeInTheDocument();
        expect(queryByText('RAW')).not.toBeInTheDocument();
        expect(queryByText('BACKGROUND')).not.toBeInTheDocument();
    });

