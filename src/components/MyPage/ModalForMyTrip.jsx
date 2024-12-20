import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaStar } from 'react-icons/fa';
import PropTypes from 'prop-types'; // PropTypes 추가
import ReviewForm from '../Review/ReviewForm';
import default_profile from '../../assets/user_profile.png';
import ReviewList from '../Review/ReviewList';

const ModalForMyTrip = ({ isOpen, onClose, place }) => {
  const [apiData, setApiData] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (place && place.name) {
      fetch(`http://3.36.99.105:3001/googleApi/keywordSearch?searchTerm=${encodeURIComponent(place.name)}`)
        .then(response => response.json())
        .then(data => {
          if (data.places && data.places[0]) {
            setApiData({
              description: data.places[0].description,
              address: data.places[0].address,
              hours: data.places[0].operating_hours,
              phone: data.places[0].phone_number,
              holidays: "", // 휴무일 정보가 필요하면 처리 추가
              photo: data.places[0].photo
            });
          }
        })
        .catch(err => console.error('API fetch error:', err));
    }
  }, [place]);

  if (!isOpen || !place) return null;

  const handleRatingClick = (rate) => {
    if (rate >= 1 && rate <= 5) {
      setRating(rate);
      setShowReviewForm(true);
    }
  };

  const handleReviewSubmit = (reviewText, selectedImages) => {
    const newReview = {
      profileImage: default_profile,
      nickname: '사용자 이름',  // 실제 사용자 이름으로 변경
      rating,
      text: reviewText,
      images: selectedImages,
      usefulCount: 10,
    };
    setReviews([newReview, ...reviews]);
    setShowReviewForm(false);
    setRating(0);
  };

  const handleReviewCancel = () => {
    setShowReviewForm(false);
    setRating(0);
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <TopSection>
          <ImageContainer>
            <PlaceImage src={apiData?.photo} alt={place.name} />
          </ImageContainer>
          <InfoContainer>
            <PlaceName>{place.name}</PlaceName>
            <PlaceDescription>
              {apiData?.description || ""}
            </PlaceDescription>
            <Rating>
              <FaStar color="#FFC978" /> 4.8
            </Rating>
            <Details>
              <DetailItem><strong>주소:</strong> {apiData?.address || ""}</DetailItem>
              <DetailItem>
                <strong>운영시간:</strong>
                {apiData?.hours && apiData.hours.length > 0 ? (
                  apiData.hours.map((hour, index) => (
                    <span key={index}>{hour}<br /></span>
                  ))
                ) : ""}
              </DetailItem>
              <DetailItem><strong>전화번호:</strong> {apiData?.phone || ""}</DetailItem>
              <DetailItem><strong>휴무일:</strong> {apiData?.holidays || ""}</DetailItem>
            </Details>
          </InfoContainer>
        </TopSection>
        <BottomSection>
          <ReviewTitle>리뷰</ReviewTitle>
          <StarContainer>
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                selected={star <= (hoveredRating || rating)}
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                aria-label={`별점 ${star}`}
              >
                <FaStar />
              </StarIcon>
            ))}
          </StarContainer>
          {!showReviewForm && <ReviewMessage>별점을 남겨주세요!</ReviewMessage>}
          <ReviewFormContainer show={showReviewForm ? true : undefined}>
            {showReviewForm && (
              <ReviewForm onSubmit={handleReviewSubmit} onCancel={handleReviewCancel} />
            )}
          </ReviewFormContainer>
          <ReviewList reviews={reviews} />
        </BottomSection>
      </ModalContent>
    </Overlay>
  );
};

ModalForMyTrip.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  place: PropTypes.object.isRequired,
};

export default ModalForMyTrip;


const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  width: 70%;
  height: 80%;
  min-height: 500px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  overflow-y: auto;
`;

const TopSection = styled.div`
  display: flex;
  overflow: hidden;
`;

const ImageContainer = styled.div`
  flex: 1.5;
  height: 280px;
  margin-right: 20px;
`;

const PlaceImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
`;

const InfoContainer = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
`;

const PlaceName = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
`;

const PlaceDescription = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 8px;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  color: #FFC978;
  margin-bottom: 16px;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: #555;
  line-height: 1.6;
`;

const DetailItem = styled.div`
  margin-bottom: 4px;
  & > strong {
    font-weight: bold;
    color: #333;
  }
`;

const BottomSection = styled.div`
  font-size: 14px;
  color: #666;
  margin-top: 20px;
  text-align: center;
`;

const ReviewTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const StarContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
`;

const StarIcon = styled.div`
  cursor: pointer;
  color: ${({ selected }) => (selected ? '#FFC978' : '#ddd')};
  font-size: 32px;
  transition: color 0.2s;

  &:hover {
    color: #FFC978;
  }
`;

const ReviewMessage = styled.p`
  text-align: center;
  color: #666;
  font-size: 14px;
`;

const ReviewFormContainer = styled.div`
  opacity: ${({ show }) => (show ? 1 : 0)};
  max-height: ${({ show }) => (show ? '500px' : '0px')};
  overflow: hidden;
  transition: opacity 0.3s ease, max-height 0.3s ease;
  margin-top: ${({ show }) => (show ? '10px' : '0px')};
`;
