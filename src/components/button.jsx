import styled from 'styled-components';

const StyledButton = styled.button`
  all: unset;
  cursor: pointer;

  ${(props) =>
        props.types === 'top' ?
            `
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    padding: 16px 24px;
    gap: 16px;
    border-radius: 8px;
    border: 1px solid #370199;
    transition: 0.3s ease;

    &:hover {
      transform: scale(1.005);
      box-shadow: 0px 4px 14px rgba(76, 75, 103, 0.2);
    }
  `:
            props.types === 'outline' ?
                `
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    padding: 16px 24px;
    gap: 16px;
    border-radius: 8px;
    transition: 0.3s ease,
                background-color 0.3s ease;
    color: #7A7A99;
    &:hover {
      background-color: #F8F8FC;
      transform: scale(1.005);
      box-shadow: 0px 4px 14px rgba(76, 75, 103, 0.2);
    }
  ` :
                ``
    }
`;

const Button = ({ children, types, onClick, className }) => {
    return <StyledButton className={className} onClick={onClick} types={types}>{children}</StyledButton>;
};

export default Button;
