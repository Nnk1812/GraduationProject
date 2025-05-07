package com.DATN.Graduation.Project.service.impl;

import com.DATN.Graduation.Project.dto.*;
import com.DATN.Graduation.Project.entity.ProductDetailEntity;
import com.DATN.Graduation.Project.entity.ProductEntity;
import com.DATN.Graduation.Project.entity.ReviewsEntity;
import com.DATN.Graduation.Project.entity.UserEntity;
import com.DATN.Graduation.Project.exception.AppException;
import com.DATN.Graduation.Project.exception.ErrorCode;
import com.DATN.Graduation.Project.mapper.ProductMapper;
import com.DATN.Graduation.Project.mapper.ReviewsMapper;
import com.DATN.Graduation.Project.repository.*;
import com.DATN.Graduation.Project.service.DiscountService;
import com.DATN.Graduation.Project.service.ProductService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import org.springframework.data.domain.Pageable;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {
    @Autowired
    private  ProductRepository productsRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private  ProductDetailRepository productDetailsRepository;
    @Autowired
    private  BrandRepository brandRepository;
    @Autowired
    private  DiscountRepository discountRepository;
    @Autowired
    private  ProductMapper productsMapper;
    @Autowired
    private  UserRepository userRepository;
    @Autowired
    private  ReviewsMapper reviewsMapper;
    @Autowired
    private  ReviewRepository reviewRepository;
    @Autowired
    private DiscountService discountService;

    @Transactional
    @Override
    public ProductDto saveProduct(ProductDto productsDto) {
        if (!ObjectUtils.isEmpty(productsDto.getCode())) {
            if (!ObjectUtils.isEmpty(productsRepository.findByCode(productsDto.getId(), productsDto.getCode()))) {
                throw new AppException(ErrorCode.PRODUCT_EXISTED);
            }
        }
        ProductEntity productsEntity;
        if (ObjectUtils.isEmpty(productsDto.getId())) {
            productsEntity = new ProductEntity();
            if (ObjectUtils.isEmpty(productsDto.getCode())) {
                productsDto.setCode(generateNextCode());
            }
        } else {
            productsEntity = productsRepository.findById(productsDto.getId()).orElse(null);
            if (ObjectUtils.isEmpty(productsEntity)) {
                throw new AppException(ErrorCode.PRODUCT_NOT_EXISTED);
            }
        }
//        if(productsRepository.getProductNames().contains(productsDto.getName())){
//            throw new AppException(ErrorCode.PRODUCT_EXISTED);
//        }


        if (ObjectUtils.isEmpty(productsDto.getIsDeleted())) {
            productsDto.setIsDeleted(false);
        } else {
            productsDto.setIsDeleted(productsDto.getIsDeleted());
        }
        if (ObjectUtils.isEmpty(productsDto.getIsActive())) {
            productsDto.setIsActive(true);
        } else {
            productsDto.setIsActive(productsDto.getIsActive());
        }
        if (!brandRepository.findBrand().contains(productsDto.getBrand())) {
            throw new AppException(ErrorCode.BRAND_NOT_EXISTED);
        }
        modelMapper.map(productsDto, productsEntity);
        ProductEntity savedProduct = productsRepository.save(productsEntity);
        ProductDetailEntity productDetailEntity;

        if (productsDto.getProductDetail() != null) {
            ProductDetailDto productDetailDto = productsDto.getProductDetail();

            if (!ObjectUtils.isEmpty(productDetailDto.getProductCode())) {
                    // Nếu có code => Tìm trong DB để cập nhật
                    productDetailEntity = productDetailsRepository.findByProduct(productDetailDto.getProductCode())
                            .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_DETAIL_NOT_EXISTED));

            } else {
                // Nếu không có code => Tạo mới entity
                productDetailEntity = new ProductDetailEntity();
                productDetailDto.setProductCode(savedProduct.getCode()); // Gán code từ sản phẩm chính
            }

            // Lưu ID cũ nếu có để tránh lỗi Hibernate
            Long existingId = productDetailEntity.getId();

            // Map dữ liệu từ DTO vào entity
            modelMapper.map(productDetailDto, productDetailEntity);

            // Đảm bảo ID không bị thay đổi
            if (existingId != null) {
                productDetailEntity.setId(existingId);
            } else {
                productDetailEntity.setId(null); // Nếu là entity mới, ID phải là null để tránh lỗi Hibernate
            }

            // Thiết lập trạng thái mặc định nếu cần
            if (ObjectUtils.isEmpty(productDetailEntity.getIsDeleted())) {
                productDetailEntity.setIsDeleted(false);
            }
            if (ObjectUtils.isEmpty(productDetailEntity.getIsActive())) {
                productDetailEntity.setIsActive(true);
            }

            // Gán productCode cho entity
            productDetailEntity.setProduct(savedProduct.getCode());

            // Lưu vào DB
            productDetailsRepository.save(productDetailEntity);

            }
            // Convert ProductsEntity -> ProductsDto
            ProductDto result = modelMapper.map(savedProduct, ProductDto.class);
            // Lấy productDetail từ database và set vào DTO
            productDetailsRepository.findByProduct(savedProduct.getCode())
                    .ifPresent(detail -> {
                        ProductDetailDto detailDto = modelMapper.map(detail, ProductDetailDto.class);
                        detailDto.setProductCode(savedProduct.getCode()); // Gán code vào DTO
                        result.setProductDetail(detailDto);
                    });
            return result;
    }
    @Override
    public List<ProductDto> getProductDetails (List<Long> ids ){
        List<ProductDto> dtoList = productsRepository.findProduct(ids);

        // Lấy productDetail tương ứng từng product
        dtoList.forEach(dto -> {
            ProductDetailDto detailDto = productDetailsRepository.findByProduct(dto.getCode())
                    .map(productsMapper::toDto) // Chuyển ProductDetailsEntity -> ProductDetailDto
                    .orElse(null);

            dto.setProductDetail(detailDto); // Gán ProductDetailDto vào ProductsDto
        });

        return dtoList;
    }
    public String generateNextCode() {

        Integer maxCode = productsRepository.findMaxCodeByPrefix();


        if (maxCode == null) {
            return "P001";
        }

        return "P" + String.format("%03d", ++maxCode);
    }

    @Override
    @Transactional
    public String deleteProduct(String code)
    {
        ProductEntity entity = productsRepository.findByCode(code).orElseThrow(
                () -> new AppException(ErrorCode.PRODUCT_NOT_EXISTED)
        );
        productsRepository.delete(entity);
        ProductDetailEntity detail = productDetailsRepository.findByProduct(entity.getCode()).orElse(null);
        if(!ObjectUtils.isEmpty(detail)) {
            productDetailsRepository.delete(detail);
        }
        return "Product deleted successfully";
    }
    @Override
    public String hiddenProduct (String code){
        ProductEntity entity = productsRepository.findByCode(code).orElseThrow(
                () -> new AppException(ErrorCode.PRODUCT_NOT_EXISTED)
        );
        entity.setIsDeleted(true);
        productsRepository.save(entity);
        return "Product hidden successfully";
    }
//    public List<ProductsEntity> lookupProduct (ProductsDto dto){
//        productsRepository.lookupProducts(dto);
//    }
    @Override
    @Transactional
    public ReviewsDto reviewProduct(ReviewsDto dto) {
        if(ObjectUtils.isEmpty(productsRepository.findByCode(dto.getProduct()))) {
            throw new AppException(ErrorCode.PRODUCT_NOT_EXISTED);
        }
        UserEntity user = userRepository.findByUserName(dto.getUser()).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED)
        );
        if(dto.getRating() < 1 || dto.getRating() > 5){
            throw new AppException(ErrorCode.VALIDATION_RATING_REVIEW);
        }
        LocalDateTime now = LocalDateTime.now().truncatedTo(ChronoUnit.MINUTES);

        dto.setCreated_at(now);
        dto.setUpdated_at(now);
        ReviewsEntity entity = reviewsMapper.toEntity(dto);
        entity.setProduct(dto.getProduct());
        entity.setUser(user.getFullName());
        reviewRepository.save(entity);
        return dto;
    }
    public RatingDto ratingProduct(String code){
        List<Double> ratings = reviewRepository.findAllByCode(code);
        if(ObjectUtils.isEmpty(ratings)) {
            return RatingDto.builder()
                    .ratingCount(0)
                    .rating(0.0)
                    .build();
        }
        Double sum = 0.0;
        for(Double rating:ratings){
            sum += rating;
        }
        return RatingDto.builder()
                .rating(sum / ratings.size())
                .ratingCount(ratings.size())
                .build();
    }
    public List<ReviewsEntity> findAllReviewsByProduct(String code){
        return reviewRepository.findAllReviewByProduct(code);
    }

    public List<FindProductDto> findAllProducts(){
        return productsRepository.findAllProduct();
    }

    public List<FindProductDto> findOutstandingProduct(Pageable pageable){
        return productsRepository.findTopFourByQuantity((Pageable) pageable);
    }
    public ProductDetailEntity getProductDetail(String code){
        return productDetailsRepository.findByProduct(code).orElse(null);
    }
    public List<FindProductDto> findByBrand(String brand){
        return productsRepository.findByBrand(brand);
    }
    public List<FindAllProductDto> findAll(){
        return productsRepository.findAllProducts();
    }
    public FindProductDetailDto findProductDetail(String code){
        return productsRepository.findAllProductsDetail(code);
    }
    public List<FindProductDto> findByName(String name){
        return productsRepository.findByProductNameIgnoreCase(name);
    }
    public String activeProduct(String code){
        ProductEntity entity = productsRepository.findByCode(code).orElseThrow(
                () -> new AppException(ErrorCode.PRODUCT_NOT_EXISTED)
        );
        entity.setIsDeleted(false);
        productsRepository.save(entity);
        return "Product activated successfully";
    }
}


