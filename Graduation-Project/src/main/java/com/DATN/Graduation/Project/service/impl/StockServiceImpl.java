package com.DATN.Graduation.Project.service.impl;

import com.DATN.Graduation.Project.entity.StockEntity;
import com.DATN.Graduation.Project.repository.StockRepository;
import com.DATN.Graduation.Project.service.StockService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class StockServiceImpl implements StockService {
    @Autowired
    private StockRepository stockRepository;

    @Override
    public List<StockEntity> findAll(){
        return stockRepository.findAll();
    }
}
