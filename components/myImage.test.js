import { MyImage } from './myImage';

describe('MyImage', () => {
  it('should return Image component with correct src', () => {
    const props = { src: '/images/example.jpg' };
    const wrapper = shallow(<MyImage {...props} />);
    expect(wrapper.find('Image').prop('src')).toBe('/session/images/example.jpg');
  });

  it('should prepend session folder to src if missing', () => {
    const props = { src: 'images/example.jpg' };
    const wrapper = shallow(<MyImage {...props} />);
    expect(wrapper.find('Image').prop('src')).toBe('/session/images/example.jpg');
  });

  it('should not modify src already containing session folder', () => {
    const props = { src: '/session/images/example.jpg' };
    const wrapper = shallow(<MyImage {...props} />);
    expect(wrapper.find('Image').prop('src')).toBe('/session/images/example.jpg');
  });

  it('should handle invalid src values', () => {
    const props = { src: null };
    const wrapper = shallow(<MyImage {...props} />);
    expect(wrapper.find('Image').prop('src')).toBeNull();
  });
});
