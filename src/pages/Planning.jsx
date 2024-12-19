import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import styled from 'styled-components';
import InviteEmailModal from '../components/Planning/InviteEmailModal';
import AddPlacesModal from '../components/Planning/AddPlacesModal';
import { updateTripData, addPlace, fetchSharedTripPlans, setCurrentTripId, fetchTripDetails, deletePlace, deleteTrip } from '../store/placeSlice';
import EditTripModal from '../components/Planning/EditTripModal';
import MapComponent from '../components/Planning/MapComponent';
import { Skeleton } from '@mui/material';
import DeletePlacesModal from '../components/Planning/DeletePlacesModal';
import { FaRegTrashCan } from "react-icons/fa6";
import { TiDelete } from "react-icons/ti"; // X자 모양 아이콘
import DeleteTripModal from '../components/Planning/DeleteTripModal';
import OrderChangeModal from '../components/Planning/OrderChangeModal';

const Planning = () => {
  const dispatch = useDispatch();

  // Redux에서 필요한 상태 가져오기
  const tripData = useSelector((state) => state.places.tripData);
  const selectedPlaces = useSelector((state) => state.places.selectedPlaces || []);
  const userId = useSelector((state) => state.user.userInfo.userId);
  const tripList = useSelector((state) => state.places.tripList);
  const currentTripId = useSelector((state) => state.places.currentTripId);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isAddPlacesModalOpen, setIsAddPlacesModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [isDeletePlaceModalOpen, setIsDeletePlaceModalOpen] = useState(false);  // 장소 삭제 모달 상태
  const [isDeleteTripModalOpen, setIsDeleteTripModalOpen] = useState(false);  // 여행 일정 삭제 모달 상태
  const [tripToDelete, setTripToDelete] = useState(null);  // 삭제할 여행 ID 저장
  const [placeToDelete, setPlaceToDelete] = useState(null);  // 삭제할 장소의 ID 저장

  // 상태 추가
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const openOrderChangeModal = () => {
    setIsOrderModalOpen(true);
  };

  const closeOrderChangeModal = () => {
    setIsOrderModalOpen(false);
  };

  const handleSaveOrder = (newOrder) => {
    console.log("New order from modal:", newOrder); // 모달에서 전달된 새로운 순서
    dispatch(updateTripData({ ...tripData, selectedPlaces: newOrder })); // Redux 상태 업데이트
  };

  useEffect(() => {
    console.log("Redux updated selectedPlaces:", selectedPlaces);
  }, [selectedPlaces]);

  const [currentDay, setCurrentDay] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 사용자 ID를 기반으로 여행 목록 불러오기
  useEffect(() => {
    if (userId) {
      dispatch(fetchSharedTripPlans(userId));
    }
  }, [userId, dispatch]);

  // tripList가 업데이트된 후에만 setCurrentTripId를 호출
  useEffect(() => {
    if (tripList.length > 0 && currentTripId === null) {
      // tripList가 존재하고 currentTripId가 비어있다면 초기 tripList의 첫 번째 여행 ID로 설정
      dispatch(setCurrentTripId(tripList[0].trip_plan_id));
    }
  }, [tripList, currentTripId, dispatch]);
  
  useEffect(() => {
    console.log("현재 선택된 여행 ID:", currentTripId);  // currentTripId 로그 확인
    console.log("tripList:", tripList);  // tripList 로그 확인
  
    if (currentTripId && tripList.length > 0) {
      const selectedTrip = tripList.find(trip => trip.trip_plan_id === parseInt(currentTripId, 10));
      console.log("selectedTrip:", selectedTrip);  // selectedTrip 확인
  
      if (selectedTrip) {
        const { start_date, end_date, trip_plan_title, destination, route_shared } = selectedTrip;
        const dayCount = dayjs(end_date).diff(dayjs(start_date), 'day') + 1;
  
        dispatch(updateTripData({
          startDate: start_date,
          endDate: end_date,
          tripTitle: trip_plan_title,
          destination,
          route_shared,
          dayCount,
        }));
      } else {
        console.warn("선택된 여행을 찾을 수 없습니다.");
      }
    }
  }, [currentTripId, tripList, dispatch]);
  

  // currentTripId가 변경될 때 세부 일정 불러오기
  useEffect(() => {
    if (currentTripId) {
      setIsLoading(true);
      dispatch(fetchTripDetails(currentTripId))
        .then(() => setIsLoading(false))
        .catch(() => setIsLoading(false));
    }
  }, [currentTripId, dispatch]);

  // 여행 선택 핸들러
  const handleTripSelect = (event) => {
    const tripId = event.target.value;
    dispatch(setCurrentTripId(tripId));
  };

  const selectedTrip = tripList.find((trip) => trip.trip_plan_id === parseInt(currentTripId, 10))

  // 여행 정보 수정 후 Redux 상태에 저장
  const handleSaveTripData = (updatedData) => {
    // Redux에 수정된 여행 데이터를 저장
    dispatch(updateTripData(updatedData));
    setIsEditModalOpen(false);
  };

    // 장소 삭제 모달 열기
  const openDeletePlaceModal = (placeId) => {
    setPlaceToDelete(placeId); // 삭제할 장소 ID 저장
    setIsDeletePlaceModalOpen(true); // 장소 삭제 모달 열기
  };

  // 여행 삭제 모달 열기
  const openDeleteTripModal = (tripPlanId) => {
    setTripToDelete(tripPlanId); // 삭제할 여행 ID 저장
    setIsDeleteTripModalOpen(true); // 여행 삭제 모달 열기
  };

  // 장소 삭제 확인 후 처리
  const handleConfirmDeletePlace = () => {
    if (placeToDelete !== null) {
      dispatch(deletePlace(placeToDelete)); // 장소 삭제
    }
    setIsDeletePlaceModalOpen(false); // 장소 삭제 모달 닫기
    setPlaceToDelete(null); // 삭제할 장소 ID 초기화
  };

  // 여행 삭제 확인 후 처리
  const handleConfirmDeleteTrip = () => {
    if (tripToDelete !== null) {
      dispatch(deleteTrip(tripToDelete)); // 여행 삭제
    }
    setIsDeleteTripModalOpen(false); // 여행 삭제 모달 닫기
    setTripToDelete(null); // 삭제할 여행 ID 초기화
  };

  // 취소 시 모달 닫기
  const handleCancelDeletePlace = () => {
    setIsDeletePlaceModalOpen(false); // 모달 닫기
    setPlaceToDelete(null); // 삭제할 장소 ID 초기화
  };

  const handleCancelDeleteTrip = () => {
    setIsDeleteTripModalOpen(false); // 모달 닫기
    setTripToDelete(null); // 삭제할 여행 ID 초기화
  };

  const handleInviteButtonClick = () => setIsInviteModalOpen(true);
  const handleInviteModalClose = () => setIsInviteModalOpen(false);
  const openAddPlacesModal = (dayIndex) => { setCurrentDay(dayIndex); setIsAddPlacesModalOpen(true); };
  const closeAddPlacesModal = () => { setIsAddPlacesModalOpen(false); setCurrentDay(null); };

  const generateDays = () => {
    if (!tripData.startDate || !tripData.endDate) return [];
    const start = dayjs(tripData.startDate);
    const end = dayjs(tripData.endDate);
    const days = [];
    for (let i = 0; start.add(i, 'day').isBefore(end) || start.add(i, 'day').isSame(end, 'day'); i++) {
      days.push(`DAY ${i + 1}`);
    }
    return days;
  };

  const formatDate = (dateString) => {
    return dayjs(dateString).format('YYYY-MM-DD');  // 기본적으로 로컬 시간대 기준으로 표시
  };

  return (
    <Container>
      <TripSelector>
        <label>여행 선택: </label>
        <select defaultValue={currentTripId || ""} onChange={handleTripSelect}>
          <option value="" disabled>여행을 선택하세요</option>
          {tripList.map((trip) => (
            <option key={trip.trip_plan_id} value={trip.trip_plan_id}>
              {trip.trip_plan_title} ({formatDate(trip.start_date)} - {formatDate(trip.end_date)})
            </option>
          ))}
        </select>
      </TripSelector>

      <ContentWrapper>
        <LeftColumn>
          <TripInfo>
          <TripTitle>{selectedTrip ? selectedTrip.trip_plan_title : '여행 제목'}</TripTitle>
            {/* X 버튼 추가: 여행 제목 오른쪽 끝에 배치 */}
            <DeleteTripButton onClick={() => openDeleteTripModal(selectedTrip.trip_plan_id)}>
              <TiDelete size={26} />
            </DeleteTripButton>
          <TripDestination>{selectedTrip ? selectedTrip.destination : '목적지 정보 없음'}</TripDestination>
          <TripDates>
          {selectedTrip ? dayjs(selectedTrip.start_date).format('YYYY.MM.DD') : ''} - {selectedTrip ? dayjs(selectedTrip.end_date).format('MM.DD') : ''}
          </TripDates>
            <ButtonContainer>
              <EditButton onClick={() => setIsEditModalOpen(true)}>수정</EditButton>
              <InviteButton onClick={handleInviteButtonClick}>+ 일행초대</InviteButton>
            </ButtonContainer>
          </TripInfo>

          {generateDays().map((day, dayIndex) => (
            <div key={dayIndex}>
              <h2>{day}</h2>
              <AddPlaceButton onClick={openOrderChangeModal}>순서 변경</AddPlaceButton>
              <PlaceList>
              {isLoading ? (
                  // 로딩 중일 때 스켈레톤 표시
                  Array.from({ length: 1 }).map((_, index) => (
                      <ResultInfo>
                        <Skeleton width="90%" height="80px" />
                      </ResultInfo>
                  ))
                ) : (
                  // 로딩이 끝나면 실제 장소 리스트 표시
                  selectedPlaces
                    .filter((place) => place.trip_day === dayIndex + 1)
                    .sort((a, b) => a.order_no - b.order_no) // order_no 순서로 정렬
                    .map((place, index) => (
                      <PlaceContainer 
                        key={place.trip_plan_detail_id}>
                            <OrderNumber>{place.order_no || index + 1}</OrderNumber>
                            <PlaceItem>
                          <PlaceContent>{place.place_name}</PlaceContent>
                          <DeleteButton onClick={() => openDeletePlaceModal(place.trip_plan_detail_id)}>
                            <FaRegTrashCan size={20} /> {/* 휴지통 아이콘 */}   
                          </DeleteButton>  {/* 삭제 버튼 추가 */}
                        </PlaceItem>
                      </PlaceContainer>
                    ))
                )}
              </PlaceList>
              <AddPlaceButton onClick={() => openAddPlacesModal(dayIndex)}>+ 장소 추가</AddPlaceButton>
            </div>
          ))}
        </LeftColumn>

        <RightColumn>
          <MapWrapper>
            <MapComponent selectedPlaces={selectedPlaces}/>
          </MapWrapper>
        </RightColumn>
      </ContentWrapper>

      <EditTripModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        tripData={selectedTrip}
        onSave={handleSaveTripData}
      />
      {isInviteModalOpen && <InviteEmailModal open={isInviteModalOpen} onClose={handleInviteModalClose} />}
      {isAddPlacesModalOpen && (
        <AddPlacesModal 
          isOpen={isAddPlacesModalOpen} 
          onClose={closeAddPlacesModal} 
          dayIndex={currentDay} // 현재 선택된 DAY 인덱스 전달
          tripId={currentTripId} // 현재 여행 ID 전달
          onConfirm={() => {}}
        />
      )}

      {/* 여행 삭제 모달 */}
      <DeleteTripModal
        isOpen={isDeleteTripModalOpen}
        onClose={handleCancelDeleteTrip}
        onConfirm={handleConfirmDeleteTrip}
      />

      {/* 장소 삭제 모달 */}
      <DeletePlacesModal
        isOpen={isDeletePlaceModalOpen}
        onClose={handleCancelDeletePlace}
        onConfirm={handleConfirmDeletePlace}
      />
      
      {/* 장소 순서 변경 모달 */}
      <OrderChangeModal
        places={selectedPlaces}
        isOpen={isOrderModalOpen}
        onClose={closeOrderChangeModal}
        onSave={handleSaveOrder}
      />
    </Container>
  );
};

export default Planning;

// 스타일 컴포넌트들

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 60px;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 20px;
  }  
`;

const TripSelector = styled.div`
  margin-bottom: 20px;
  label {
    margin-right: 10px;
  }
  select {
    padding: 5px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column; /* 모바일에서는 세로 배치 */
  }
`

const LeftColumn = styled.div`
  flex: 0.6;
  padding-right: 20px;
  overflow-y: auto;
  height: 60vh;

  @media (max-width: 768px) {
    max-height: 50vh;
    overflow-y: auto;
    padding-right: 0;
    margin-bottom: 20px;
  }  
`;

const RightColumn = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  height: 60vh; /* LeftColumn과 같은 높이 */

  @media (max-width: 768px) {
    width: 100%;
    height: 40vh;
  }  
`;

const MapWrapper = styled.div`
  width: 100%;
  height: 100%;

  @media (max-width: 768px) {
    height: 100%;
  }  
`;

const TripInfo = styled.div`
  text-align: left;
  margin-bottom: 20px;
  position: relative; /* X 버튼을 위치시키기 위해 상대적 위치 지정 */
`;

const TripTitle = styled.h1`
  font-size: 28px;
  font-weight: bold;
  margin: 0;
`;

const DeleteTripButton = styled.button`
  position: absolute;
  right: 0;
  top: 8px;
  background: none;
  border: none;
  color: black;
  cursor: pointer;
  font-size: 20px;
  
  &:hover {
    color: red;
    transition: color 0.3s ease; /* 색상 변화가 0.3초 동안 부드럽게 진행되도록 설정 */
  }

  &:active {
    color: darkred;
    transform: scale(0.94);
  }
`;

const TripDestination = styled.div`
  font-size: 18px;
  color: #777;
  margin-top: 4px;
`;

const TripDates = styled.div`
  font-size: 16px;
  color: #555;
  margin-top: 8px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 12px;
`;

const EditButton = styled.button`
  background-color: #ff9f00;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e87a00;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const InviteButton = styled.button`
  background-color: #507dbc;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #3f5f8a;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const AddPlaceButton = styled.button`
  margin-top: 12px;
  margin-bottom: 12px;
  padding: 8px 16px;
  background-color: #507dbc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #3f5f8a;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const PlaceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PlaceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 55vh;  /* 높이를 설정하여 스크롤 가능 */
  overflow-y: auto;  /* 스크롤 활성화 */

  /* 모바일 화면에서 max-height 조정 */
  @media (max-width: 768px) {
    max-height: 30vh;
  }
`;

const PlaceItem = styled.div`
  flex: 1;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  min-height: 50px;
  display: flex;  /* flex 설정으로 항목들이 겹치지 않게 조정 */
  align-items: center;
  justify-content: space-between;
`;

const OrderNumber = styled.div`
  width: 20px;
  height: 20px;
  background-color: #007bff;
  color: white;
  font-weight: bold;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
`;

const PlaceContent = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

const DeleteButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    color: red;
    transition: color 0.3s ease; /* 색상 변화가 0.3초 동안 부드럽게 진행되도록 설정 */
  }

  &:active {
    color: darkred; /* 클릭 시 아이콘 색상 변화 */
    transform: scale(0.90); /* 클릭 시 크기 변화 */
    transition: transform 0.1s ease; /* 클릭 효과에 대한 부드러운 전환 */
  }
`;

const ResultInfo = styled.div`
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

