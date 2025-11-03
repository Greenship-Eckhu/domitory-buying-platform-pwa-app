import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import Screen from '@/components/Screen'
import ScrollView from '@/components/ScrollView'
import { extractProductInfo } from '@/services/productService'
import { detectPlatform, normalizeUrl, isValidProductUrl } from '@/utils/urlParser'
import { parseQuantityFromText, formatQuantity } from '@/utils/quantityParser'
import { Product } from '@/types/product'
import { THEME } from '@/constants/theme'

function AddProduct() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 상품 정보 상태
  const [product, setProduct] = useState<Partial<Product>>({
    name: '',
    thumbnail: '',
    price: undefined,
    quantity: '',
    unit: '',
    originalUrl: '',
    platform: 'unknown'
  })

  // 폼 상태
  const [showQuantityInput, setShowQuantityInput] = useState(false)
  const [showPriceInput, setShowPriceInput] = useState(false)

  useEffect(() => {
    const initProduct = async () => {
      try {
        // Web Share Target으로 받은 URL 가져오기
        const sharedUrl = searchParams.get('url') || searchParams.get('text') || ''

        if (!sharedUrl) {
          setError('공유된 URL이 없습니다.')
          setLoading(false)
          return
        }

        // URL 유효성 검사
        if (!isValidProductUrl(sharedUrl)) {
          setError('유효하지 않은 상품 URL입니다. 쿠팡 상품 링크를 공유해주세요.')
          setLoading(false)
          return
        }

        const normalizedUrl = normalizeUrl(sharedUrl)
        const platform = detectPlatform(normalizedUrl)

        // Open Graph 정보 추출
        const metadata = await extractProductInfo(normalizedUrl)

        if (!metadata.title || !metadata.image) {
          setError('상품 정보를 불러올 수 없습니다. 다시 시도해주세요.')
          setLoading(false)
          return
        }

        // 수량 정보 자동 파싱
        const parsedQuantity = parseQuantityFromText(metadata.title)

        // 가격 정보 확인
        const hasPrice = metadata.price && !isNaN(Number(metadata.price))

        setProduct({
          name: metadata.title,
          thumbnail: metadata.image,
          price: hasPrice ? Number(metadata.price) : undefined,
          quantity: parsedQuantity ? parsedQuantity.quantity.toString() : '',
          unit: parsedQuantity?.unit || '',
          originalUrl: normalizedUrl,
          platform
        })

        // 수량 또는 가격이 없으면 입력창 표시
        setShowQuantityInput(!parsedQuantity)
        setShowPriceInput(!hasPrice)

        setLoading(false)
      } catch (err) {
        console.error('Failed to init product:', err)
        setError(err instanceof Error ? err.message : '상품 정보를 불러오는데 실패했습니다.')
        setLoading(false)
      }
    }

    initProduct()
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 유효성 검사
    if (!product.name || !product.thumbnail) {
      alert('상품 정보가 올바르지 않습니다.')
      return
    }

    if (showPriceInput && !product.price) {
      alert('가격을 입력해주세요.')
      return
    }

    if (showQuantityInput && (!product.quantity || !product.unit)) {
      alert('수량과 단위를 입력해주세요.')
      return
    }

    // TODO: 실제 저장 로직 구현 (예: API 호출, LocalStorage 저장 등)
    console.log('Saving product:', product)

    alert('상품이 추가되었습니다!')
    navigate('/')
  }

  const handleCancel = () => {
    navigate('/')
  }

  if (loading) {
    return (
      <Screen title="상품 추가" showBackButton>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>상품 정보를 불러오는 중...</LoadingText>
        </LoadingContainer>
      </Screen>
    )
  }

  if (error) {
    return (
      <Screen title="상품 추가" showBackButton>
        <ErrorContainer>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorText>{error}</ErrorText>
          <RetryButton onClick={handleCancel}>돌아가기</RetryButton>
        </ErrorContainer>
      </Screen>
    )
  }

  return (
    <Screen title="상품 추가" showBackButton>
      <FormContainer>
        <Form onSubmit={handleSubmit}>
          {/* 상품 미리보기 */}
          <PreviewSection>
            <ThumbnailContainer>
              <Thumbnail src={product.thumbnail} alt={product.name} />
            </ThumbnailContainer>
            <ProductInfo>
              <ProductName>{product.name}</ProductName>
              <PlatformBadge $platform={product.platform || 'unknown'}>
                {product.platform === 'coupang' ? '쿠팡' : '기타'}
              </PlatformBadge>
            </ProductInfo>
          </PreviewSection>

          {/* 가격 입력 */}
          {showPriceInput ? (
            <FormGroup>
              <Label>
                가격 <Required>*</Required>
              </Label>
              <Input
                type="number"
                placeholder="가격을 입력하세요"
                value={product.price || ''}
                onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
                required
              />
              <HelperText>가격 정보를 찾을 수 없어 직접 입력이 필요합니다.</HelperText>
            </FormGroup>
          ) : (
            <FormGroup>
              <Label>가격</Label>
              <PriceDisplay>{product.price?.toLocaleString()}원</PriceDisplay>
            </FormGroup>
          )}

          {/* 수량 입력 */}
          {showQuantityInput ? (
            <FormGroup>
              <Label>
                수량 정보 <Required>*</Required>
              </Label>
              <QuantityInputGroup>
                <Input
                  type="number"
                  placeholder="수량"
                  value={product.quantity || ''}
                  onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
                  required
                />
                <Input
                  type="text"
                  placeholder="단위 (예: 개, kg, ml)"
                  value={product.unit || ''}
                  onChange={(e) => setProduct({ ...product, unit: e.target.value })}
                  required
                />
              </QuantityInputGroup>
              <HelperText>수량 정보를 찾을 수 없어 직접 입력이 필요합니다.</HelperText>
            </FormGroup>
          ) : (
            <FormGroup>
              <Label>수량</Label>
              <PriceDisplay>
                {product.quantity && product.unit
                  ? formatQuantity(Number(product.quantity), product.unit)
                  : '수량 정보 없음'}
              </PriceDisplay>
            </FormGroup>
          )}

          {/* 버튼 */}
          <ButtonGroup>
            <CancelButton type="button" onClick={handleCancel}>
              취소
            </CancelButton>
            <SubmitButton type="submit">상품 추가</SubmitButton>
          </ButtonGroup>
        </Form>
      </FormContainer>
    </Screen>
  )
}

const FormContainer = styled(ScrollView)`
  padding: 20px;
  background-color: #f8f9fa;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const PreviewSection = styled.div`
  display: flex;
  gap: 16px;
  padding: 16px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`

const ThumbnailContainer = styled.div`
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f0f0f0;
`

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const ProductInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const ProductName = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const PlatformBadge = styled.span<{ $platform: string }>`
  display: inline-block;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 4px;
  width: fit-content;
  background-color: ${props => {
    if (props.$platform === 'coupang') return THEME.colors.theme3
    return '#999'
  }};
  color: white;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  background-color: #ffffff;
  padding: 16px;
  border-radius: 12px;
`

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`

const Required = styled.span`
  color: #ff4444;
  margin-left: 4px;
`

const Input = styled.input`
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${THEME.colors.theme3};
  }

  &::placeholder {
    color: #999;
  }
`

const QuantityInputGroup = styled.div`
  display: flex;
  gap: 8px;

  ${Input}:first-child {
    flex: 2;
  }

  ${Input}:last-child {
    flex: 1;
  }
`

const PriceDisplay = styled.div`
  padding: 12px;
  font-size: 18px;
  font-weight: 600;
  color: ${THEME.colors.theme4};
  background-color: #f8f9fa;
  border-radius: 8px;
`

const HelperText = styled.p`
  font-size: 12px;
  color: #666;
  margin: 0;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`

const Button = styled.button`
  flex: 1;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:active {
    transform: scale(0.98);
  }
`

const CancelButton = styled(Button)`
  background-color: #f0f0f0;
  color: #666;

  &:hover {
    background-color: #e0e0e0;
  }
`

const SubmitButton = styled(Button)`
  background-color: ${THEME.colors.theme3};
  color: white;

  &:hover {
    background-color: ${THEME.colors.theme4};
  }
`

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
`

const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid #f0f0f0;
  border-top-color: ${THEME.colors.theme3};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

const LoadingText = styled.p`
  font-size: 16px;
  color: #666;
`

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
  padding: 20px;
`

const ErrorIcon = styled.div`
  font-size: 48px;
`

const ErrorText = styled.p`
  font-size: 16px;
  color: #666;
  text-align: center;
  line-height: 1.5;
`

const RetryButton = styled.button`
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  background-color: ${THEME.colors.theme3};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: ${THEME.colors.theme4};
  }
`

export default AddProduct
