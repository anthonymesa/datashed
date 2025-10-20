import renderer from 'react-test-renderer';
import ActionIconAdd from './ActionIconAdd';

it("Renders an icon", () => {
    const component = renderer.create(
        <ActionIconAdd />
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
})

// it("When clicked, updates state accordingly", () => {

// }) 