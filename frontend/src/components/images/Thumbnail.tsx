import styled from "styled-components";

export const Thumbnail = ({
  id,
  photo,
  onClick,
}: {
  id: number;
  photo: string;
  onClick: (id: number) => void;
}) => {
  const handleClick = () => {
    onClick(id);
  };

  return <Image src={photo} alt="" onClick={handleClick} />;
};

const Image = styled.img`
  cursor: pointer;
  height: 100px;
  width: 100px;
`;
