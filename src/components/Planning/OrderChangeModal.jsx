import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const OrderChangeModal = ({ places, isOpen, onClose, onSave }) => {
  const [updatedPlaces, setUpdatedPlaces] = useState([...places]);

    useEffect(() => {
        setUpdatedPlaces([...places]); // 모달 열릴 때 데이터 설정
    }, [places]);

  const moveItem = (index, direction) => {
    const newPlaces = [...updatedPlaces];
    const targetIndex = index + direction;

    // 범위를 초과하지 않도록 조건 설정
    if (targetIndex < 0 || targetIndex >= newPlaces.length) return;

    // 배열 순서 변경
    const [removed] = newPlaces.splice(index, 1);
    newPlaces.splice(targetIndex, 0, removed);

    setUpdatedPlaces(newPlaces);
  };

  const handleSave = () => {
    onSave(updatedPlaces); // 저장 버튼 클릭 시 부모로 전달
    onClose(); // 모달 닫기
  };

  if (!isOpen) return null;

  return (
    <Overlay>
      <ModalContent>
        <h2>장소 순서 변경</h2>
        <List>
          {updatedPlaces.map((place, index) => (
            <ListItem key={place.trip_plan_detail_id}>
              <PlaceName>{place.place_name}</PlaceName>
              <ButtonContainer>
                <ArrowButton onClick={() => moveItem(index, -1)}>▲</ArrowButton>
                <ArrowButton onClick={() => moveItem(index, 1)}>▼</ArrowButton>
              </ButtonContainer>
            </ListItem>
          ))}
        </List>
        <ModalActions>
          <SaveButton onClick={handleSave}>저장</SaveButton>
          <CancelButton onClick={onClose}>취소</CancelButton>
        </ModalActions>
      </ModalContent>
    </Overlay>
  );
};

export default OrderChangeModal;

// 스타일 컴포넌트
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-height: 80vh;
  overflow-y: auto;
`;

const List = styled.div`
  margin: 20px 0;
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const PlaceName = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const ArrowButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const SaveButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;

  &:hover {
    background: #218838;
  }
`;

const CancelButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;

  &:hover {
    background: #c82333;
  }
`;
